const SUPABASE_URL =
    "https://ibqrxueyxrresvarfggm.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_K9BnZiIWoPCsxcP93FHL7g_vswpNF8r";


const supabaseClient =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


// ==========================================
// ESTADO DO SISTEMA
// ==========================================

let contasCache = [];
let transacoesCache = [];


// ==========================================
// ELEMENTOS
// ==========================================

const telaLogin =
    document.getElementById(
        "telaLogin"
    );

const telaCadastro =
    document.getElementById(
        "telaCadastro"
    );

const sistema =
    document.getElementById(
        "sistema"
    );


// ==========================================
// LOGIN / CADASTRO
// ==========================================

function mostrarLogin() {

    telaLogin.classList.remove(
        "oculto"
    );

    telaCadastro.classList.add(
        "oculto"
    );

    sistema.classList.add(
        "oculto"
    );

}


function mostrarCadastro() {

    telaLogin.classList.add(
        "oculto"
    );

    telaCadastro.classList.remove(
        "oculto"
    );

    sistema.classList.add(
        "oculto"
    );

}


function mostrarSistema() {

    telaLogin.classList.add(
        "oculto"
    );

    telaCadastro.classList.add(
        "oculto"
    );

    sistema.classList.remove(
        "oculto"
    );

}


document
    .getElementById(
        "btnMostrarCadastro"
    )
    .addEventListener(
        "click",
        mostrarCadastro
    );


document
    .getElementById(
        "btnVoltarLogin"
    )
    .addEventListener(
        "click",
        mostrarLogin
    );


// CADASTRO

document
    .getElementById(
        "formCadastro"
    )
    .addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();

            const email =
                document
                    .getElementById(
                        "emailCadastro"
                    )
                    .value;

            const password =
                document
                    .getElementById(
                        "senhaCadastro"
                    )
                    .value;

            const mensagem =
                document
                    .getElementById(
                        "mensagemCadastro"
                    );


            mensagem.textContent =
                "Criando conta...";


            const { error } =
                await supabaseClient
                    .auth
                    .signUp({
                        email,
                        password
                    });


            if (error) {

                mensagem.textContent =
                    "Erro: " +
                    error.message;

                return;

            }


            mensagem.textContent =
                "Cadastro realizado.";

        }
    );


// LOGIN

document
    .getElementById(
        "formLogin"
    )
    .addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();

            const email =
                document
                    .getElementById(
                        "emailLogin"
                    )
                    .value;

            const password =
                document
                    .getElementById(
                        "senhaLogin"
                    )
                    .value;

            const mensagem =
                document
                    .getElementById(
                        "mensagemLogin"
                    );


            mensagem.textContent =
                "Entrando...";


            const { data, error } =
                await supabaseClient
                    .auth
                    .signInWithPassword({
                        email,
                        password
                    });


            if (error) {

                mensagem.textContent =
                    "Erro: " +
                    error.message;

                return;

            }


            mensagem.textContent = "";


            mostrarSistema();


            atualizarUsuario(
                data.user
            );


            abrirPagina("inicio");


            await carregarDados();

        }
    );


// SAIR

document
    .getElementById(
        "btnSair"
    )
    .addEventListener(
        "click",
        async function() {

            await supabaseClient
                .auth
                .signOut();


            mostrarLogin();

        }
    );


// ==========================================
// USUÁRIO
// ==========================================

function atualizarUsuario(
    usuario
) {

    const elemento =
        document.getElementById(
            "emailUsuario"
        );


    if (
        elemento &&
        usuario
    ) {

        elemento.textContent =
            usuario.email;

    }

}


async function pegarUsuario() {

    const { data } =
        await supabaseClient
            .auth
            .getUser();


    return data.user;

}


// ==========================================
// NAVEGAÇÃO
// ==========================================

const paginas =
    document.querySelectorAll(
        ".pagina"
    );


const botoesMenu =
    document.querySelectorAll(
        "[data-pagina]"
    );


function abrirPagina(
    nome
) {

    paginas.forEach(
        function(pagina) {

            pagina.classList.remove(
                "ativa"
            );

        }
    );


    document
        .getElementById(nome)
        .classList.add("ativa");


    botoesMenu.forEach(
        function(botao) {

            botao.classList.toggle(
                "ativo",
                botao.dataset.pagina ===
                    nome
            );

        }
    );

}


botoesMenu.forEach(
    function(botao) {

        botao.addEventListener(
            "click",
            function() {

                abrirPagina(
                    botao.dataset.pagina
                );

            }
        );

    }
);


// ==========================================
// ATALHOS INÍCIO
// ==========================================

document
    .getElementById(
        "btnVerContas"
    )
    .addEventListener(
        "click",
        function() {

            abrirPagina(
                "contas"
            );

        }
    );


document
    .getElementById(
        "btnVerTransacoes"
    )
    .addEventListener(
        "click",
        function() {

            abrirPagina(
                "transacoes"
            );

        }
    );


document
    .getElementById(
        "btnReceitaRapida"
    )
    .addEventListener(
        "click",
        function() {

            abrirFormularioTransacao(
                "receita"
            );

        }
    );


document
    .getElementById(
        "btnDespesaRapida"
    )
    .addEventListener(
        "click",
        function() {

            abrirFormularioTransacao(
                "despesa"
            );

        }
    );


document
    .getElementById(
        "btnContaRapida"
    )
    .addEventListener(
        "click",
        function() {

            abrirPagina(
                "contas"
            );


            document
                .getElementById(
                    "areaFormularioConta"
                )
                .classList.remove(
                    "oculto"
                );

        }
    );


// ==========================================
// FORM TRANSAÇÃO
// ==========================================

const areaFormularioTransacao =
    document.getElementById(
        "areaFormularioTransacao"
    );


function abrirFormularioTransacao(
    tipoSelecionado = ""
) {

    abrirPagina(
        "transacoes"
    );


    areaFormularioTransacao
        .classList.remove(
            "oculto"
        );


    document
        .getElementById(
            "tipo"
        )
        .value =
        tipoSelecionado;


    document
        .getElementById(
            "tituloFormTransacao"
        )
        .textContent =
        tipoSelecionado ===
            "receita"
            ? "Nova receita"
            : tipoSelecionado ===
              "despesa"
            ? "Nova despesa"
            : "Nova transação";

}


document
    .getElementById(
        "btnNovaTransacao"
    )
    .addEventListener(
        "click",
        function() {

            abrirFormularioTransacao();

        }
    );


document
    .getElementById(
        "btnCancelarTransacao"
    )
    .addEventListener(
        "click",
        function() {

            areaFormularioTransacao
                .classList.add(
                    "oculto"
                );

        }
    );


// ==========================================
// FORM CONTA
// ==========================================

const areaFormularioConta =
    document.getElementById(
        "areaFormularioConta"
    );


document
    .getElementById(
        "btnNovaConta"
    )
    .addEventListener(
        "click",
        function() {

            areaFormularioConta
                .classList.remove(
                    "oculto"
                );

        }
    );


document
    .getElementById(
        "btnCancelarConta"
    )
    .addEventListener(
        "click",
        function() {

            areaFormularioConta
                .classList.add(
                    "oculto"
                );

        }
    );


// ==========================================
// SALVAR CONTA
// ==========================================

document
    .getElementById(
        "formConta"
    )
    .addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const usuario =
                await pegarUsuario();


            if (!usuario) {
                return;
            }


            const nome =
                document
                    .getElementById(
                        "nomeConta"
                    )
                    .value;


            const tipo =
                document
                    .getElementById(
                        "tipoConta"
                    )
                    .value;


            const saldoInicial =
                Number(
                    document
                        .getElementById(
                            "saldoInicial"
                        )
                        .value
                );


            const mensagem =
                document
                    .getElementById(
                        "mensagemConta"
                    );


            mensagem.textContent =
                "Salvando...";


            const { error } =
                await supabaseClient
                    .from("Contas")
                    .insert([
                        {
                            nome,
                            tipo,

                            saldo_inicial:
                                saldoInicial,

                            ativo: true,

                            user_id:
                                usuario.id
                        }
                    ]);


            if (error) {

                mensagem.textContent =
                    "Erro: " +
                    error.message;

                return;

            }


            mensagem.textContent =
                "Conta salva.";


            event.target.reset();


            document
                .getElementById(
                    "saldoInicial"
                )
                .value = 0;


            areaFormularioConta
                .classList.add(
                    "oculto"
                );


            await carregarDados();

        }
    );


// ==========================================
// SALVAR TRANSAÇÃO
// ==========================================

document
    .getElementById(
        "formTransacao"
    )
    .addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const usuario =
                await pegarUsuario();


            if (!usuario) {
                return;
            }


            const descricao =
                document
                    .getElementById(
                        "descricao"
                    )
                    .value;


            const valor =
                Number(
                    document
                        .getElementById(
                            "valor"
                        )
                        .value
                );


            const data =
                document
                    .getElementById(
                        "data"
                    )
                    .value;


            const tipo =
                document
                    .getElementById(
                        "tipo"
                    )
                    .value;


            const contaId =
                Number(
                    document
                        .getElementById(
                            "contaTransacao"
                        )
                        .value
                );


            const mensagem =
                document
                    .getElementById(
                        "mensagemTransacao"
                    );


            mensagem.textContent =
                "Salvando...";


            const { error } =
                await supabaseClient
                    .from("transacoes")
                    .insert([
                        {
                            descricao,
                            valor,
                            data,
                            tipo,

                            conta_id:
                                contaId,

                            user_id:
                                usuario.id
                        }
                    ]);


            if (error) {

                mensagem.textContent =
                    "Erro: " +
                    error.message;

                return;

            }


            mensagem.textContent =
                "Transação salva.";


            event.target.reset();


            document
                .getElementById(
                    "data"
                )
                .value =
                hoje();


            areaFormularioTransacao
                .classList.add(
                    "oculto"
                );


            await carregarDados();

        }
    );


// ==========================================
// BUSCAR DADOS
// ==========================================

async function buscarContas() {

    const { data, error } =
        await supabaseClient
            .from("Contas")
            .select("*")
            .order("nome");


    if (error) {

        console.error(error);

        return [];

    }


    return data || [];

}


async function buscarTransacoes() {

    const { data, error } =
        await supabaseClient
            .from("transacoes")
            .select("*")
            .order(
                "data",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(error);

        return [];

    }


    return data || [];

}


// ==========================================
// CÁLCULO CONTA
// ==========================================

function calcularSaldoConta(
    conta
) {

    let receitas = 0;
    let despesas = 0;


    transacoesCache.forEach(
        function(item) {

            if (
                Number(
                    item.conta_id
                ) !==
                Number(
                    conta.id
                )
            ) {

                return;

            }


            const valor =
                Number(
                    item.valor || 0
                );


            if (
                item.tipo ===
                "receita"
            ) {

                receitas += valor;

            }


            if (
                item.tipo ===
                "despesa"
            ) {

                despesas += valor;

            }

        }
    );


    const saldoInicial =
        Number(
            conta.saldo_inicial || 0
        );


    return {

        saldoInicial,

        receitas,

        despesas,

        saldoAtual:
            saldoInicial +
            receitas -
            despesas

    };

}


// ==========================================
// CONTAS
// ==========================================

function mostrarContas() {

    const lista =
        document.getElementById(
            "listaContas"
        );


    const select =
        document.getElementById(
            "contaTransacao"
        );


    lista.innerHTML = "";


    select.innerHTML = `
        <option value="">
            Selecione uma conta
        </option>
    `;


    contasCache.forEach(
        function(conta) {

            const calculo =
                calcularSaldoConta(
                    conta
                );


            const classeSaldo =
                calculo.saldoAtual < 0
                    ? "saldo-negativo"
                    : "saldo-positivo";


            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "conta-card";


            card.innerHTML = `

                <h3>
                    ${conta.nome}
                </h3>

                <p class="texto-suave">
                    ${conta.tipo || ""}
                </p>

                <p>
                    Saldo inicial:
                    <strong>
                        ${formatarDinheiro(
                            calculo.saldoInicial
                        )}
                    </strong>
                </p>

                <p>
                    Receitas:
                    <strong class="tipo-receita">
                        ${formatarDinheiro(
                            calculo.receitas
                        )}
                    </strong>
                </p>

                <p>
                    Despesas:
                    <strong class="tipo-despesa">
                        ${formatarDinheiro(
                            calculo.despesas
                        )}
                    </strong>
                </p>

                <p>
                    Saldo atual:
                    <strong class="${classeSaldo}">
                        ${formatarDinheiro(
                            calculo.saldoAtual
                        )}
                    </strong>
                </p>

            `;


            lista.appendChild(
                card
            );


            const option =
                document.createElement(
                    "option"
                );


            option.value =
                conta.id;


            option.textContent =
                conta.nome;


            select.appendChild(
                option
            );

        }
    );

}


// CONTAS INÍCIO

function mostrarContasInicio() {

    const area =
        document.getElementById(
            "contasInicio"
        );


    area.innerHTML = "";


    contasCache.forEach(
        function(conta) {

            const calculo =
                calcularSaldoConta(
                    conta
                );


            const classeSaldo =
                calculo.saldoAtual < 0
                    ? "saldo-negativo"
                    : "saldo-positivo";


            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "conta-inicio-card";


            card.innerHTML = `

                <div>

                    <strong>
                        ${conta.nome}
                    </strong>

                    <small>
                        ${conta.tipo || ""}
                    </small>

                </div>

                <strong class="${classeSaldo}">
                    ${formatarDinheiro(
                        calculo.saldoAtual
                    )}
                </strong>

            `;


            area.appendChild(
                card
            );

        }
    );

}


// ==========================================
// TRANSAÇÕES
// ==========================================

function nomeContaPorId(
    contaId
) {

    const conta =
        contasCache.find(
            function(item) {

                return (
                    Number(item.id) ===
                    Number(contaId)
                );

            }
        );


    return conta
        ? conta.nome
        : "Conta";

}


function criarLinhaTransacao(
    item,
    mostrarExcluir = false
) {

    const linha =
        document.createElement(
            "tr"
        );


    const classe =
        item.tipo === "receita"
            ? "tipo-receita"
            : "tipo-despesa";


    const sinal =
        item.tipo === "receita"
            ? "+"
            : "−";


    linha.innerHTML = `

        <td>
            ${formatarData(
                item.data
            )}
        </td>

        <td>
            ${item.descricao || ""}
        </td>

        <td>
            ${nomeContaPorId(
                item.conta_id
            )}
        </td>

        <td class="${classe}">
            ${item.tipo}
        </td>

        <td class="${classe}">
            ${sinal}
            ${formatarDinheiro(
                item.valor
            )}
        </td>

        ${
            mostrarExcluir
                ? `
                    <td>

                        <button
                            class="btn-excluir"
                            data-excluir="${item.id}"
                        >
                            Excluir
                        </button>

                    </td>
                `
                : ""
        }

    `;


    return linha;

}


// TODAS

function mostrarTransacoes(
    lista = transacoesCache
) {

    const tbody =
        document.getElementById(
            "listaTransacoes"
        );


    tbody.innerHTML = "";


    if (
        lista.length === 0
    ) {

        tbody.innerHTML = `

            <tr>

                <td colspan="6">
                    Nenhuma transação encontrada.
                </td>

            </tr>

        `;

        return;

    }


    lista.forEach(
        function(item) {

            tbody.appendChild(
                criarLinhaTransacao(
                    item,
                    true
                )
            );

        }
    );

}


// ÚLTIMOS

function mostrarUltimosLancamentos() {

    const tbody =
        document.getElementById(
            "ultimosLancamentos"
        );


    tbody.innerHTML = "";


    const ultimos =
        transacoesCache.slice(
            0,
            5
        );


    if (
        ultimos.length === 0
    ) {

        tbody.innerHTML = `

            <tr>

                <td colspan="5">
                    Nenhum lançamento.
                </td>

            </tr>

        `;

        return;

    }


    ultimos.forEach(
        function(item) {

            tbody.appendChild(
                criarLinhaTransacao(
                    item,
                    false
                )
            );

        }
    );

}


// ==========================================
// FILTROS
// ==========================================

function aplicarFiltros() {

    const texto =
        document
            .getElementById(
                "buscaTransacao"
            )
            .value
            .toLowerCase();


    const tipo =
        document
            .getElementById(
                "filtroTipo"
            )
            .value;


    const filtradas =
        transacoesCache.filter(
            function(item) {

                const descricao =
                    (
                        item.descricao ||
                        ""
                    )
                    .toLowerCase();


                const conta =
                    nomeContaPorId(
                        item.conta_id
                    )
                    .toLowerCase();


                const textoOk =
                    descricao.includes(
                        texto
                    ) ||
                    conta.includes(
                        texto
                    );


                const tipoOk =
                    tipo === "todos" ||
                    item.tipo === tipo;


                return (
                    textoOk &&
                    tipoOk
                );

            }
        );


    mostrarTransacoes(
        filtradas
    );

}


document
    .getElementById(
        "buscaTransacao"
    )
    .addEventListener(
        "input",
        aplicarFiltros
    );


document
    .getElementById(
        "filtroTipo"
    )
    .addEventListener(
        "change",
        aplicarFiltros
    );


// ==========================================
// EXCLUIR TRANSAÇÃO
// ==========================================

document
    .getElementById(
        "listaTransacoes"
    )
    .addEventListener(
        "click",
        async function(event) {

            const botao =
                event.target.closest(
                    "[data-excluir]"
                );


            if (!botao) {
                return;
            }


            const id =
                Number(
                    botao.dataset.excluir
                );


            const confirmar =
                confirm(
                    "Excluir este lançamento?"
                );


            if (!confirmar) {
                return;
            }


            const { error } =
                await supabaseClient
                    .from(
                        "transacoes"
                    )
                    .delete()
                    .eq(
                        "id",
                        id
                    );


            if (error) {

                alert(
                    "Erro ao excluir: " +
                    error.message
                );

                return;

            }


            await carregarDados();

        }
    );


// ==========================================
// DASHBOARD
// ==========================================

function atualizarDashboard() {

    let saldoInicial = 0;
    let receitas = 0;
    let despesas = 0;


    contasCache.forEach(
        function(conta) {

            saldoInicial +=
                Number(
                    conta.saldo_inicial ||
                    0
                );

        }
    );


    transacoesCache.forEach(
        function(item) {

            const valor =
                Number(
                    item.valor || 0
                );


            if (
                item.tipo ===
                "receita"
            ) {

                receitas += valor;

            }


            if (
                item.tipo ===
                "despesa"
            ) {

                despesas += valor;

            }

        }
    );


    const saldo =
        saldoInicial +
        receitas -
        despesas;


    const saldoElemento =
        document.getElementById(
            "saldoTotal"
        );


    saldoElemento.textContent =
        formatarDinheiro(
            saldo
        );


    saldoElemento.classList.toggle(
        "saldo-negativo",
        saldo < 0
    );


    saldoElemento.classList.toggle(
        "saldo-positivo",
        saldo >= 0
    );


    document
        .getElementById(
            "totalReceitas"
        )
        .textContent =
        formatarDinheiro(
            receitas
        );


    document
        .getElementById(
            "totalDespesas"
        )
        .textContent =
        formatarDinheiro(
            despesas
        );

}


// ==========================================
// CARREGAR DADOS
// ==========================================

async function carregarDados() {

    contasCache =
        await buscarContas();


    transacoesCache =
        await buscarTransacoes();


    mostrarContas();

    mostrarContasInicio();

    mostrarTransacoes();

    mostrarUltimosLancamentos();

    atualizarDashboard();

}


// ==========================================
// UTILIDADES
// ==========================================

function formatarDinheiro(
    valor
) {

    return Number(
        valor || 0
    )
    .toLocaleString(
        "pt-BR",
        {
            style:
                "currency",

            currency:
                "BRL"
        }
    );

}


function formatarData(
    data
) {

    if (!data) {
        return "";
    }


    const partes =
        data.split("-");


    if (
        partes.length !== 3
    ) {

        return data;

    }


    return (
        partes[2] +
        "/" +
        partes[1] +
        "/" +
        partes[0]
    );

}


function hoje() {

    return new Date()
        .toISOString()
        .split("T")[0];

}


document
    .getElementById(
        "data"
    )
    .value =
    hoje();


// ==========================================
// INICIALIZAÇÃO
// ==========================================

async function iniciar() {

    const { data } =
        await supabaseClient
            .auth
            .getSession();


    if (
        data.session
    ) {

        mostrarSistema();


        atualizarUsuario(
            data.session.user
        );


        abrirPagina(
            "inicio"
        );


        await carregarDados();

    } else {

        mostrarLogin();

    }

}


iniciar();