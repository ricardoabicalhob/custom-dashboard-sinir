'use server'

import { LoginResponseI } from "@/interfaces/login.interface"
import { MTRCompleteResponseI, MTRResponseI } from "@/interfaces/mtr.interface"
import { MTRUseCases } from "@/usecases/mtr.usecase"

export async function GetMTRs(auth :string, loginResponse :LoginResponseI, dataInicio :string, dataFim :string) {

    const mtrUseCase = new MTRUseCases()

    if(auth && loginResponse) {
        try {
            const geradorPromise = mtrUseCase.findAllGerador(loginResponse.objetoResposta.parCodigo, dataInicio, dataFim, auth)
                .then(async response => {
                    const mtrList = Array.from(response.objetoResposta)
                    const promises = mtrList.map(async mtr => {
                        const mtrResponse = mtr as MTRResponseI
                        const promise = await mtrUseCase.findByNumber(mtrResponse?.manNumero, auth)
                        // const resPromise = await Promise.resolve(promise)
                        return promise
                    })
                    
                    const mtrComplete = await Promise.all(promises)
                    

                    const allObjectsResponseNoFilter = mtrComplete
                        .filter(mtrData => {
                            const mtrCompleteResponse = mtrData as MTRCompleteResponseI
                            return(
                                mtrCompleteResponse &&
                                mtrCompleteResponse.objetoResposta &&
                                mtrCompleteResponse.objetoResposta.situacaoManifesto &&
                                mtrCompleteResponse.objetoResposta.situacaoManifesto.simDescricao !== "Cancelado"
                            )
                        })
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
                    const data :any[] = [...allObjectsResponseFilteredReceived]

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

                    return { data, allMTRsReceivedFiltered, allMTRsReceivedNoFilter };
                })
                .catch(error => {
                    console.error(error || "Erro ao carregar os MTRs")
                })

            const armazenadorPromise = mtrUseCase.findAllArmazenadorTemporario(loginResponse.objetoResposta.parCodigo, dataInicio, dataFim, auth)
                .then(async response => {
                    const mtrList = Array.from(response.objetoResposta)
                    const promises = mtrList.map(mtr => {
                        const mtrResponse = mtr as MTRResponseI
                        return mtrUseCase.findByNumber(mtrResponse.manNumero, auth)
                    })

                    const mtrComplete = await Promise.all(promises)
                    
                    const allObjectsResponseNoFilter = mtrComplete
                        .filter(mtrData => {
                            const mtrCompleteResponse = mtrData as MTRCompleteResponseI
                            return(
                                mtrCompleteResponse &&
                                mtrCompleteResponse.objetoResposta &&
                                mtrCompleteResponse.objetoResposta.situacaoManifesto &&
                                mtrCompleteResponse.objetoResposta.situacaoManifesto.simDescricao !== "Cancelado"
                            )
                        })
                        .map(mtrDataFiltrado => (mtrDataFiltrado as MTRCompleteResponseI).objetoResposta)
                    
                    const allObjectsResponseFiltered = mtrComplete
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

                        const allObjectsResponseFilteredReceivedAT = mtrComplete
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

                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const data :any[] = [...allObjectsResponseFiltered]

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
                    const allMTRsReceivedFiltered :any[] = allObjectsResponseFiltered.map(mtrToFilter => ({
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
                    const allMTRsReceivedFilteredReceivedAT :any[] = allObjectsResponseFilteredReceivedAT.map(mtrToFilter => ({
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

                    return { data, allMTRsReceivedFiltered, allMTRsReceivedNoFilter, allMTRsReceivedFilteredReceivedAT }
                });

            const [geradorResult, armazenadorResult] = await Promise.all([geradorPromise, armazenadorPromise])

            return { gerador: geradorResult, armazenamentoTemporario: armazenadorResult }

        } catch (error) {
            console.error("Erro ao buscar MTRs:", error)
            return { gerador: undefined, armazenamentoTemporario: undefined }
        }
    } else {
        return { gerador: undefined, armazenamentoTemporario: undefined }
    }
}