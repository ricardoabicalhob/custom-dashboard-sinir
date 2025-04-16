import { MTRRepositoryI } from "@/interfaces/mtr.interface";
import api from "@/services/api";

class MTRRepositoryFetch implements MTRRepositoryI {
    async downloadMTR(numeroMTR: string, authorization :string) :Promise<unknown>{
        try {
            const response = await api.post(`/apiws/rest/downloadManifesto/${numeroMTR}`, {
                headers: {
                    "Authorization": `Bearer ${authorization}`
                }
            })
            return response.data
        } catch (error :unknown) {
            if(error instanceof Error) {
                throw new Error(error.message || "Ocorreu um erro no repositório.")
            } else {
                throw new Error("Erro desconhecido")
            }
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async findAllArmazenadorTemporario(unidade :number, dataInicio :string, dataFim :string, authorization :string): Promise<any | null> {
        try {
            const response = await api.get(`/api/mtr/pesquisaMtr/${unidade}/0/18/10/${dataInicio}/${dataFim}/0/all?size=99999&first=0`, {
                headers: {
                    "Authorization": `Bearer ${authorization}`
                }
            })
            return response.data
        } catch (error :unknown) {
            if(error instanceof Error) {
                throw new Error(error.message || 'Ocorreu um erro no repositório.')
            } else {
                throw new Error("Erro desconhecido")
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async findAllGerador(unidade: number, dataInicio :string, dataFim :string, authorization: string): Promise<any | null> {
        try {
            const response = await api.get(`/api/mtr/pesquisaMtr/${unidade}/0/18/8/${dataInicio}/${dataFim}/0/all?size=99999&first=0`, {
                headers: {
                    "Authorization": `Bearer ${authorization}`
                }
            })
            return response.data
        } catch (error :unknown) {
            if(error instanceof Error) {
                throw new Error(error.message || 'Ocorreu um erro no repositório.')
            } else {
                throw new Error("Erro desconhecido")
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async findByNumber(numberMTR: string, authorization: string): Promise<any | null> {
        try {
            const response = await api.get(`/apiws/rest/retornaManifesto/${numberMTR}` , {
                headers: {
                    "Authorization": `Bearer ${authorization}`
                }
            })
            return response.data
        } catch (error :unknown) {
            if(error instanceof Error) {
                throw new Error(error.message || 'Ocorreu um erro no repositório.')
            } else {
                throw new Error("Erro desconhecido")
            }
        }
    }
}
export { MTRRepositoryFetch }