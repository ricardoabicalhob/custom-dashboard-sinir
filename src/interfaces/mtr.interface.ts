export interface MTRResponseI {
    manNumero: string;
    manData: number;
    manResponsavel: string;
    manDataExpedicao: number;
    manNomeMotorista: string;
    manPlacaVeiculo: string;
    manObservacao: string | null; // Pode ser null
    manJustificativaCancelamento: string;
    estado: {
        estCodigo: number;
        estAbreviacao: string;
    };
    parceiroGerador: {
        parCodigo: number;
        parDescricao: string;
        parCnpj: string;
    };
    parceiroTransportador: {
        parCodigo: number;
        parDescricao: string;
        parCnpj: string;
    };
    parceiroDestinador: {
        parCodigo: number;
        parDescricao: string;
        parCnpj: string;
    };
    parceiroArmazenadorTemporario: {
        parCodigo: number | null; // Pode ser null
        parDescricao: string;
        parCnpj: string | null; // Pode ser null
    };
    situacaoManifesto: {
        simCodigo: number;
        simDescricao: string;
        simOrdem: number;
        simDataRecebimento: string;
    };
    dataRecebimentoAT: string;
    listaManifestoResiduo: [
        {
        residuo: {
            resCodigo: number;
            resCodigoIbama: string;
            resDescricao: string;
        };
        unidade: {
            uniCodigo: number;
            uniDescricao: string;
            uniSigla: string;
        };
        tratamento: {
            traCodigo: number;
            traDescricao: string;
        };
        tipoEstado: {
            tieCodigo: number;
            tieDescricao: string;
        };
        tipoAcondicionamento: {
            tiaCodigo: number;
            tiaDescricao: string;
        };
        classe: {
            claCodigo: number;
            claDescricao: string;
            claResolucao: string;
        };
        marQuantidade: number;
        marQuantidadeRecebida: number;
        marDensidade: number; 
        marJustificativa: string;
        marObservacao: string | null
        marNumeroONU: number | null 
        marClasseRisco: number | null 
        marNomeEmbarque: string | null
        grupoEmbalagem: number | null 
        marDescricaoInterna: string | null 
        marCodigoInterno: number | null 
        }
    ];
    manNumeroEstadual: string;
    cdfNumero: number;
  }

export interface MTRCompleteResponseI {
    erro :boolean
    mensagem :string | null
    objetoResposta :{
        manNumero: string;
        manData: number;
        manResponsavel: string;
        manDataExpedicao: number;
        manNomeMotorista: string;
        manPlacaVeiculo: string;
        manObservacao: string | null; // Pode ser null
        manJustificativaCancelamento: string;
        estado: {
            estCodigo: number;
            estAbreviacao: string;
        };
        parceiroGerador: {
            parCodigo: number;
            parDescricao: string;
            parCnpj: string;
        };
        parceiroTransportador: {
            parCodigo: number;
            parDescricao: string;
            parCnpj: string;
        };
        parceiroDestinador: {
            parCodigo: number;
            parDescricao: string;
            parCnpj: string;
        };
        parceiroArmazenadorTemporario: {
            parCodigo: number | null; // Pode ser null
            parDescricao: string;
            parCnpj: string | null; // Pode ser null
        };
        situacaoManifesto: {
            simCodigo: number;
            simDescricao: string;
            simOrdem: number;
            simDataRecebimento: string;
        };
        dataRecebimentoAT: string;
        listaManifestoResiduo: [
            {
            residuo: {
                resCodigo: number;
                resCodigoIbama: string;
                resDescricao: string;
            };
            unidade: {
                uniCodigo: number;
                uniDescricao: string;
                uniSigla: string;
            };
            tratamento: {
                traCodigo: number;
                traDescricao: string;
            };
            tipoEstado: {
                tieCodigo: number;
                tieDescricao: string;
            };
            tipoAcondicionamento: {
                tiaCodigo: number;
                tiaDescricao: string;
            };
            classe: {
                claCodigo: number;
                claDescricao: string;
                claResolucao: string;
            };
            marQuantidade: number;
            marQuantidadeRecebida: number;
            marDensidade: number; 
            marJustificativa: string;
            marObservacao: string | null
            marNumeroONU: number | null 
            marClasseRisco: number | null 
            marNomeEmbarque: string | null
            grupoEmbalagem: number | null 
            marDescricaoInterna: string | null 
            marCodigoInterno: number | null 
            }
        ];
        manNumeroEstadual: string;
        cdfNumero: number;
    }
    totalRecords :number
}

export interface MTRQueryResponseI {
    mensagem :string,
    objetoResposta :MTRResponseI[]
    totalRecords :number
    error :boolean
}

export interface MTRRepositoryI {
    downloadMTR(numeroMTR :string, authorization :string) :Promise<unknown>
    findAllArmazenadorTemporario(unidade :number, dataInicio :string, dataFim :string, authorization :string) :Promise<unknown | null>
    findAllGerador(unidade :number, dataInicio :string, dataFim :string, authorization :string) :Promise<unknown | null>
    findByNumber(numberMTR :string, authorization :string) :Promise<unknown | null>
}