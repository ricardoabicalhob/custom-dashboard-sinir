'use server'

import { LoginResponseI } from "@/interfaces/login.interface";
import { MTRCompleteResponseI, MTRResponseI } from "@/interfaces/mtr.interface";
import { MTRUseCases } from "@/usecases/mtr.usecase";
import { DataFilteredProps } from "../page";

export async function GetMTRsArmazTemp(auth :string, loginResponse :LoginResponseI, dataInicio :string, dataFim :string) {
    const mtrUseCase = new MTRUseCases()
    if(auth && loginResponse) {
        try {
            const armazenadorTempPromise = mtrUseCase.findAllArmazenadorTemporario(loginResponse.objetoResposta.parCodigo, dataInicio, dataFim, auth)
                .then(async response => {
                    const mtrList = Array.from(response.objetoResposta) as MTRResponseI[]
                    const promises = mtrList.map(mtr => {
                        const mtrResponse = mtr as MTRResponseI
                        return mtrUseCase.findByNumber(mtrResponse.manNumero, auth)
                    })

                    const mtrComplete = await Promise.all(promises)
                    const allObjectsResponse = mtrComplete
                        .filter(mtrData => {
                            const mtrCompleteResponse = mtrData as MTRCompleteResponseI
                            return(
                                mtrCompleteResponse &&
                                mtrCompleteResponse.objetoResposta &&
                                mtrCompleteResponse.objetoResposta.situacaoManifesto &&
                                mtrCompleteResponse.objetoResposta.situacaoManifesto.simDescricao === "Armaz Temporário - Recebido"
                            )
                        })
                        .map(mtrDataFiltrado => (mtrDataFiltrado as MTRCompleteResponseI).objetoResposta)

                        const data :MTRResponseI[] = [...allObjectsResponse]
                        const dataFiltered :DataFilteredProps[] = allObjectsResponse.map(mtrToFilter => ({
                            numeroMtr: mtrToFilter.manNumero,
                            residuoDescricao: mtrToFilter.listaManifestoResiduo[0]?.residuo?.resDescricao,
                            residuoCodigoIbama: mtrToFilter.listaManifestoResiduo[0]?.residuo?.resCodigoIbama,
                            quantidadeEstimada: mtrToFilter.listaManifestoResiduo[0]?.marQuantidade,
                            quantidadeReal: mtrToFilter.listaManifestoResiduo[0]?.marQuantidadeRecebida,
                            unidadeDescricao: mtrToFilter.parceiroGerador?.parDescricao,
                            destinadorDescricao: mtrToFilter.parceiroDestinador.parDescricao,
                            situacao: mtrToFilter.situacaoManifesto?.simDescricao,
                            medidaUnidade: mtrToFilter.listaManifestoResiduo[0]?.unidade?.uniSigla,
                            dataRecebimentoAT: mtrToFilter.dataRecebimentoAT
                        }))
    
                        return { data, dataFiltered }
                })
            const [armazenadorTempResult] = await Promise.all([armazenadorTempPromise])
        
            return {armazenadorTempResult: armazenadorTempResult}
        } catch (error) {
            console.error("Erro ao buscar MTRs:", error)
            return { armazenadorTempResult: undefined }
        }
    } else {
        return { armazenadorTempResult: undefined }
    }
}