'use server'

import { LoginResponseI } from "@/interfaces/login.interface";
import { MTRCompleteResponseI, MTRResponseI } from "@/interfaces/mtr.interface";
import { MTRUseCases } from "@/usecases/mtr.usecase";

export async function getMtrs(auth :string, loginResponse :LoginResponseI, dataInicio :string, dataFim :string) {
    const mtrUseCase = new MTRUseCases()

    if(auth && loginResponse) {
        try {
            const allGerador = await mtrUseCase.findAllGerador(loginResponse.objetoResposta.parCodigo, dataInicio, dataFim, auth)
                .then(async response => {
                    const mtrList = Array.from(response.objetoResposta)

                    const promises = mtrList.map(mtr => {
                        const mtrResponse = mtr as MTRResponseI
                        return mtrUseCase.findByNumber(mtrResponse.manNumero, auth)
                    })

                    const mtrComplete = await Promise.all(promises)
                    
                    const allObjectsResponseNoFilter = mtrComplete
                        .map(mtrDataFiltrado => (mtrDataFiltrado as MTRCompleteResponseI).objetoResposta)
                    
                    const allObjectsResponseFilteredReceived = mtrComplete
                        .filter(mtrData => {
                            const mtrCompleteResponse = mtrData as MTRCompleteResponseI
                            return(
                                mtrCompleteResponse &&
                                mtrCompleteResponse.objetoResposta &&
                                mtrCompleteResponse.objetoResposta.situacaoManifesto &&
                                mtrCompleteResponse.objetoResposta.situacaoManifesto.simDescricao === "Recebido"
                            )
                        })
                        .map(mtrDataFiltrado => (mtrDataFiltrado as MTRCompleteResponseI).objetoResposta)

                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const allMTRsReceivedNoFilter :any[] = allObjectsResponseNoFilter.map(mtrToFilter => ({
                        numeroMtr: mtrToFilter.manNumero,
                        residuoDescricao: mtrToFilter.listaManifestoResiduo[0]?.residuo?.resDescricao,
                        residuoCodigoIbama: mtrToFilter.listaManifestoResiduo[0]?.residuo?.resCodigoIbama,
                        quantidadeEstimada: mtrToFilter.listaManifestoResiduo[0]?.marQuantidade,
                        quantidadeReal: mtrToFilter.listaManifestoResiduo[0]?.marQuantidadeRecebida,
                        unidadeDescricao: mtrToFilter.parceiroGerador?.parDescricao,
                        destinadorDescricao: mtrToFilter.parceiroDestinador.parDescricao,
                        situacao: mtrToFilter.situacaoManifesto?.simDescricao,
                        medidaUnidade: mtrToFilter.listaManifestoResiduo[0]?.unidade?.uniSigla
                    }))

                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const allMTRsReceivedFiltered :any[] = allObjectsResponseFilteredReceived.map(mtrToFilter => ({
                        numeroMtr: mtrToFilter.manNumero,
                        residuoDescricao: mtrToFilter.listaManifestoResiduo[0]?.residuo?.resDescricao,
                        residuoCodigoIbama: mtrToFilter.listaManifestoResiduo[0]?.residuo?.resCodigoIbama,
                        quantidadeEstimada: mtrToFilter.listaManifestoResiduo[0]?.marQuantidade,
                        quantidadeReal: mtrToFilter.listaManifestoResiduo[0]?.marQuantidadeRecebida,
                        unidadeDescricao: mtrToFilter.parceiroGerador?.parDescricao,
                        destinadorDescricao: mtrToFilter.parceiroDestinador.parDescricao,
                        situacao: mtrToFilter.situacaoManifesto?.simDescricao,
                        medidaUnidade: mtrToFilter.listaManifestoResiduo[0]?.unidade?.uniSigla
                    }))

                    return { allMTRsReceivedFiltered, allMTRsReceivedNoFilter };
                })
            return allGerador
        } catch (error) {
            
        }
    }
}