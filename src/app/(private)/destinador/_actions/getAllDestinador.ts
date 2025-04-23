'use server'

import { MTRCompleteResponseI, MTRQueryResponseI, MTRResponseI } from "@/interfaces/mtr.interface"
import { MTRUseCases } from "@/usecases/mtr.usecase"

export async function GetAllDestinador(unidade :number, dataInicio :string, dataFim :string, auth :string) {
    const mtrUseCases = new MTRUseCases()

    const response :MTRQueryResponseI = await mtrUseCases.findAllDestinador(unidade, dataInicio, dataFim, auth)

    if(!response) { throw new Error("Nenhum mtr encontrado") }

    const promisesMTR = response.objetoResposta.map(async mtr => {
        const mtrByNumber :MTRCompleteResponseI = await mtrUseCases.findByNumber(mtr.manNumero, auth)

        if(!mtrByNumber) { throw new Error("MTR não encontrado") }

        return mtrByNumber.objetoResposta
    })

    const listMTRByNumberPromisesResolved :MTRResponseI[] = await Promise.all(promisesMTR)
        
    const allObjectsReceived = listMTRByNumberPromisesResolved.filter(mtrData => {
        const mtrCompleteResponse = mtrData as MTRResponseI
        return(
            mtrCompleteResponse &&
            mtrCompleteResponse.situacaoManifesto &&
            mtrCompleteResponse.situacaoManifesto.simDescricao === "Recebido"
        )
    })

    const allObjectsNoFilter = listMTRByNumberPromisesResolved.filter(mtrData => {
        const mtrCompleteResponse = mtrData as MTRResponseI
        return(
            mtrCompleteResponse &&
            mtrCompleteResponse.situacaoManifesto &&
            mtrCompleteResponse.situacaoManifesto.simDescricao !== "Cancelado"
        )
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allMTRsDestinedReceived :any[] = allObjectsReceived.map(mtrToFilter => ({
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
    const allMTRsNoFilter :any[] = allObjectsNoFilter.map(mtrToFilter => ({
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

    return { allMTRsDestinedReceived, allMTRsNoFilter }
}