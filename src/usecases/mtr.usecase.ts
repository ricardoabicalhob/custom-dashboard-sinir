import { MTRRepositoryFetch } from "@/repositories/mtr.repository";

class MTRUseCases {
    private mtrRepositoryFetch :MTRRepositoryFetch

    constructor() {
        this.mtrRepositoryFetch = new MTRRepositoryFetch()
    }

    downloadMTR(numeroMTR :string, authorization :string) {
        const result = this.mtrRepositoryFetch.downloadMTR(numeroMTR, authorization)
        return result
    }

    findAllArmazenadorTemporario(unidade :number, dataInicio :string, dataFim :string, authorization :string) {
        const result = this.mtrRepositoryFetch.findAllArmazenadorTemporario(unidade, dataInicio, dataFim, authorization)
        return result
    }

    findAllGerador(unidade :number, dataInicio :string, dataFim :string, authorization :string) {
        const result = this.mtrRepositoryFetch.findAllGerador(unidade, dataInicio, dataFim, authorization)
        return result
    }

    findAllDestinador(unidade :number, dataInicio :string, dataFim :string, authorization :string) {
        const result = this.mtrRepositoryFetch.findAllDestinador(unidade, dataInicio, dataFim, authorization)
        return result
    }

    findByNumber(numberMTR :string, authorization :string) {
        const result = this.mtrRepositoryFetch.findByNumber(numberMTR, authorization)
        return result
    }
}

export { MTRUseCases }