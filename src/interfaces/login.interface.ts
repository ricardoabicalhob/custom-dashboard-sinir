export interface LoginRequestI {
    login :string
    parCodigo :string
    senha :string
}

export interface LoginResponseI {
    mensagem: string,
    objetoResposta :{
        paaCodigo :number
        paaNome :string
        parCodigo :number
        parDescricao :string
        login :string
        senha :string
        cidCodigo :unknown
        estCodigo :number
        token :string
        decTipo :unknown
        paaAdmin :boolean
        isGerador :boolean
        isGeradorANP :boolean
        isTransportador :unknown
        isTransportadorANP:boolean
        isDestinador :unknown
        isDestinadorANP :boolean
        isArmazenadorTemporario :unknown
        jurCnp :string
        parTipoPessoa :string
        paaCpf :string
        anoExercicio :unknown
        anoReferencia :unknown
        dataInicioInventario :unknown
        dataLimiteEnvioInventario :unknown
        podeEnviarInventario :unknown
        isGestorTitular :boolean
        isDelegatario :boolean
        isOperadorLR :boolean
        isDestinadorLR :boolean
        parAceiteTermoUso :boolean
        senhaValida :boolean
        dataLimiteSinir :unknown
        dataHoje :unknown
        mensagemPrazoSinir :unknown
        gestorTitular :boolean
        gerador :boolean
        geradorANP :boolean
        transportador :unknown
        transportadorANP :boolean
        destinadorANP :boolean
        armazenadorTemporario :unknown
        delegatario :boolean
        operadorLR :boolean
        destinadorLR :boolean
        destinador :unknown
    },
    totalRecords :number
    erro :boolean
}