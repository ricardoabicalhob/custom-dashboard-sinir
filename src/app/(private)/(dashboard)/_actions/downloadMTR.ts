'use server'

import { MTRUseCases } from "@/usecases/mtr.usecase"

export async function downloadMTR(numeroMTR :string, authorization :string) {
    const mtrUseCase = new MTRUseCases()

    await mtrUseCase.downloadMTR(numeroMTR, authorization)
        .then(()=> console.log("Download concluído"))
        .catch(error => console.log(error))
}