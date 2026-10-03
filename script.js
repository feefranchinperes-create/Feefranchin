const SUPABASE_URL =
    "https://ibqrxueyxrresvarfggm.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_K9BnZiIWoPCsxcP93FHL7g_vswpNF8r";


const supabaseClient =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


let contasCache = [];
let transacoesCache = [];

let mesAtual =
    new Date().getMonth();

let anoAtual =
    new Date().getFullYear();


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


// ================================
// LOGIN
// ================================

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
    .onclick =
    mostrarCadastro;


document
    .getElementById(
        "btnVoltarLogin"
    )
    .onclick =
    mostrarLogin;


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


            const { error } =
                await supabaseClient
                    .auth
                    .signUp({
                        email,
                        password
                    });


            mensagem.textContent =
                error
                ? "Erro: " +
                  error.message
                : "Cadastro realizado.";

        }
    );


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


            abrirPagina(
                "inicio"
            );


            await carregarDados();

        }
    );


document
    .getElementById(
        "btnSair"
    )
    .onclick =
    async function() {

        await supabaseClient
            .auth
            .signOut();


        mostrarLogin();

    };


// ================================
// MENU LATERAL
// ================================

const menuLateral =
    document.getElementById(
        "menuLateral"
    );

const menuOverlay =
    document.getElementById(
        "menuOverlay"
    );


function abrirMenu() {

    menuLateral
        .classList
        .add("aberto");

    menuOverlay
        .classList
        .remove("oculto");

}


function fecharMenu() {

    menuLateral
        .classList
        .remove("aberto");

    menuOverlay
        .classList
        .add("oculto");

}


document
    .getElementById(
        "btnMenu"
    )
    .onclick =
    abrirMenu;


menuOverlay.onclick =
    fecharMenu;


// ================================
// USUÁRIO
// ================================

function atualizarUsuario(
    usuario
) {

    if (!usuario) {
        return;
    }


    document
        .getElementById(
            "emailUsuario"
        )
        .textContent =
        usuario.email;

}


async function pegarUsuario() {

    const { data } =
        await supabaseClient
            .auth
            .getUser();


    return data.user;

}


// ================================
// PÁGINAS
// ================================

const titulos = {

    inicio:
        "Resumo",

    contas:
        "Contas",

    transacoes:
        "Transações"

};


function abrirPagina(
    nome
) {

    document
        .querySelectorAll(
            ".pagina"
        )
        .forEach(
            pagina =>
                pagina.classList
                    .remove(
                        "ativa"
                    )
        );


    document
        .getElementById(
            nome
        )
        .classList
        .add(
            "ativa"
        );


    document
        .querySelectorAll(
            "[data-pagina]"
        )
        .forEach(
            botao =>
                botao.classList
                    .toggle(
                        "ativo",
                        botao.dataset
                            .pagina ===
                            nome
                    )
        );


    document
        .getElementById(
            "tituloPagina"
        )
        .textContent =
        titulos[nome];


    document
        .querySelector(
            ".botao-home"
        )
        .style.display =
        nome === "inicio"
            ? "block"
            : "none";


    fecharMenu();

}


document
    .querySelectorAll(
        "[data-pagina]"
    )
    .forEach(
        function(botao) {

            botao.onclick =
            function() {

                abrirPagina(
                    botao.dataset.pagina
                );

            };

        }
    );


document
    .getElementById(
        "btnVerContas"
    )
    .onclick =
    () =>
        abrirPagina(
            "contas"
        );


document
    .getElementById(
        "btnVerTransacoes"
    )
    .onclick =
    () =>
        abrirPagina(
            "transacoes"
        );


// ================================
// MÊS
// ================================

const meses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro"
];


function atualizarMes() {

    document
        .getElementById(
            "nomeMes"
        )
        .textContent =
        meses[mesAtual];


    carregarDados();

}


document
    .getElementById(
        "mesAnterior"
    )
    .onclick =
    function() {

        mesAtual--;

        if (mesAtual < 0) {

            mesAtual = 11;
            anoAtual--;

        }

        atualizarMes();

    };


document
    .getElementById(
        "mesSeguinte"
    )
    .onclick =
    function() {

        mesAtual++;

        if (mesAtual > 11) {

            mesAtual = 0;
            anoAtual++;

        }

        atualizarMes();

    };


// ================================
// BOTÃO +
// ================================

const menuMais =
    document.getElementById(
        "menuMais"
    );


document
    .getElementById(
        "btnMais"
    )
    .onclick =
    function() {

        menuMais
            .classList
            .toggle(
                "oculto"
            );

    };


// ================================
// FORM CONTA
// ================================

const areaFormularioConta =
    document.getElementById(
        "areaFormularioConta"
    );


document
    .getElementById(
        "btnNovaConta"
    )
    .onclick =
    function() {

        areaFormularioConta
            .classList
            .remove(
                "oculto"
            );

    };


document
    .getElementById(
        "btnContaRapida"
    )
    .onclick =
    function() {

        menuMais
            .classList
            .add(
                "oculto"
            );

        abrirPagina(
            "contas"
        );

        areaFormularioConta
            .classList
            .remove(
                "oculto"
            );

    };


document
    .getElementById(
        "btnCancelarConta"
    )
    .onclick =
    function() {

        areaFormularioConta
            .classList
            .add(
                "oculto"
            );

    };


// ================================
// FORM TRANSAÇÃO
// ================================

const areaFormularioTransacao =
    document.getElementById(
        "areaFormularioTransacao"
    );


function abrirTransacao(
    tipo = ""
) {

    abrirPagina(
        "transacoes"
    );


    areaFormularioTransacao
        .classList
        .remove(
            "oculto"
        );


    document
        .getElementById(
            "tipo"
        )
        .value =
        tipo;


    document
        .getElementById(
            "tituloFormTransacao"
        )
        .textContent =
        tipo === "receita"
            ? "Nova Receita"
            : tipo === "despesa"
            ? "Nova Despesa"
            : "Nova Transação";

}


document
    .getElementById(
        "btnNovaTransacao"
    )
    .onclick =
    () =>
        abrirTransacao();


document
    .getElementById(
        "btnReceitaRapida"
    )
    .onclick =
    function() {

        menuMais
            .classList
            .add(
                "oculto"
            );

        abrirTransacao(
            "receita"
        );

    };


document
    .getElementById(
        "btnDespesaRapida"
    )
    .onclick =
    function() {

        menuMais
            .classList
            .add(
                "oculto"
            );

        abrirTransacao(
            "despesa"
        );

    };


document
    .getElementById(
        "btnCancelarTransacao"
    )
    .onclick =
    function() {

        areaFormularioTransacao
            .classList
            .add(
                "oculto"
            );

    };


// ================================
// SALVAR CONTA
// ================================

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


            const { error } =
                await supabaseClient
                    .from("Contas")
                    .insert([
                        {
                            nome,
                            tipo,

                            saldo_inicial:
                                saldoInicial,

                            ativo:
                                true,

                            user_id:
                                usuario.id
                        }
                    ]);


            if (error) {

                document
                    .getElementById(
                        "mensagemConta"
                    )
                    .textContent =
                    "Erro: " +
                    error.message;

                return;

            }


            event.target.reset();


            areaFormularioConta
                .classList
                .add(
                    "oculto"
                );


            await carregarDados();

        }
    );


// ================================
// SALVAR TRANSAÇÃO
// ================================

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


            const { error } =
                await supabaseClient
                    .from(
                        "transacoes"
                    )
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

                document
                    .getElementById(
                        "mensagemTransacao"
                    )
                    .textContent =
                    "Erro: " +
                    error.message;

                return;

            }


            event.target.reset();


            document
                .getElementById(
                    "data"
                )
                .value =
                hoje();


            areaFormularioTransacao
                .classList
                .add(
                    "oculto"
                );


            await carregarDados();

        }
    );


// ================================
// BUSCAR
// ================================

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
                    ascending:
                        false
                }
            );


    if (error) {

        console.error(error);

        return [];

    }


    return data || [];

}


// ================================
// FILTRAR POR MÊS
// ================================

function transacoesDoMes() {

    return transacoesCache.filter(
        function(item) {

            if (!item.data) {
                return false;
            }


            const data =
                new Date(
                    item.data +
                    "T12:00:00"
                );


            return (
                data.getMonth() ===
                    mesAtual &&
                data.getFullYear() ===
                    anoAtual
            );

        }
    );

}


// ================================
// CÁLCULO
// ================================

function saldoDaConta(
    conta,
    transacoes
) {

    let receitas = 0;
    let despesas = 0;


    transacoes.forEach(
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


    return (
        Number(
            conta.saldo_inicial ||
            0
        )
        +
        receitas
        -
        despesas
    );

}


// ================================
// CONTAS
// ================================

function mostrarContas() {

    const listaPagina =
        document.getElementById(
            "listaContas"
        );


    const listaResumo =
        document.getElementById(
            "contasInicio"
        );


    const select =
        document.getElementById(
            "contaTransacao"
        );


    listaPagina.innerHTML = "";
    listaResumo.innerHTML = "";


    select.innerHTML = `
        <option value="">
            Selecione uma conta
        </option>
    `;


    contasCache.forEach(
        function(conta) {

            const saldo =
                saldoDaConta(
                    conta,
                    transacoesCache
                );


            const classe =
                saldo < 0
                    ? "saldo-negativo"
                    : "saldo-positivo";


            const inicial =
                (
                    conta.nome ||
                    "C"
                )
                .charAt(0)
                .toUpperCase();


            listaResumo
                .insertAdjacentHTML(
                    "beforeend",
                    `

                    <div class="conta-resumo">

                        <div class="icone-conta">
                            ${inicial}
                        </div>

                        <div class="conta-info">

                            <strong>
                                ${conta.nome}
                            </strong>

                            <small>
                                ${conta.tipo || ""}
                            </small>

                        </div>

                        <strong class="valor-conta ${classe}">
                            ${formatarDinheiro(
                                saldo
                            )}
                        </strong>

                    </div>

                    `
                );


            listaPagina
                .insertAdjacentHTML(
                    "beforeend",
                    `

                    <article class="conta-pagina">

                        <div class="icone-conta">
                            ${inicial}
                        </div>

                        <div class="conta-info">

                            <strong>
                                ${conta.nome}
                            </strong>

                            <small>
                                ${conta.tipo || ""}
                            </small>

                        </div>

                        <strong class="valor-conta ${classe}">
                            ${formatarDinheiro(
                                saldo
                            )}
                        </strong>

                    </article>

                    `
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


// ================================
// LANÇAMENTOS
// ================================

function nomeConta(
    id
) {

    const conta =
        contasCache.find(
            conta =>
                Number(
                    conta.id
                ) ===
                Number(id)
        );


    return conta
        ? conta.nome
        : "Conta";

}


function criarLancamentoHTML(
    item
) {

    const despesa =
        item.tipo ===
        "despesa";


    const classe =
        despesa
            ? "despesa"
            : "receita";


    const sinal =
        despesa
            ? "− "
            : "+ ";


    return `

        <div class="lancamento">

            <div class="icone-lancamento ${classe}">
                ${
                    despesa
                        ? "−"
                        : "+"
                }
            </div>


            <div class="lancamento-info">

                <strong>
                    ${item.descricao || ""}
                </strong>

                <small>
                    ${nomeConta(
                        item.conta_id
                    )}
                </small>

            </div>


            <div class="lancamento-valor">

                <strong class="${
                    despesa
                        ? "saldo-negativo"
                        : "saldo-positivo"
                }">

                    ${sinal}

                    ${formatarDinheiro(
                        item.valor
                    )}

                </strong>

                <small>
                    ${formatarData(
                        item.data
                    )}
                </small>

            </div>

        </div>

    `;

}


function mostrarLancamentos(
    lista = transacoesDoMes()
) {

    const area =
        document.getElementById(
            "listaTransacoes"
        );


    area.innerHTML = "";


    if (
        lista.length === 0
    ) {

        area.innerHTML =
            "<p>Nenhum lançamento neste mês.</p>";

        return;

    }


    lista.forEach(
        item => {

            area.insertAdjacentHTML(
                "beforeend",
                criarLancamentoHTML(
                    item
                )
            );

        }
    );

}


function mostrarUltimos() {

    const area =
        document.getElementById(
            "ultimosLancamentos"
        );


    area.innerHTML = "";


    const ultimos =
        transacoesDoMes()
            .slice(
                0,
                5
            );


    if (
        ultimos.length === 0
    ) {

        area.innerHTML =
            "<p>Nenhum lançamento.</p>";

        return;

    }


    ultimos.forEach(
        item => {

            area.insertAdjacentHTML(
                "beforeend",
                criarLancamentoHTML(
                    item
                )
            );

        }
    );

}


// ================================
// RESUMO
// ================================

function atualizarResumo() {

    const transacoes =
        transacoesDoMes();


    let receitas = 0;
    let despesas = 0;


    transacoes.forEach(
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

            } else {

                despesas += valor;

            }

        }
    );


    let saldoInicial = 0;


    contasCache.forEach(
        conta => {

            saldoInicial +=
                Number(
                    conta.saldo_inicial ||
                    0
                );

        }
    );


    let saldoTotal = 0;


    contasCache.forEach(
        conta => {

            saldoTotal +=
                saldoDaConta(
                    conta,
                    transacoesCache
                );

        }
    );


    document
        .getElementById(
            "saldoTotal"
        )
        .textContent =
        formatarDinheiro(
            saldoTotal
        );


    document
        .getElementById(
            "saldoCabecalho"
        )
        .textContent =
        formatarDinheiro(
            saldoTotal
        );


    document
        .getElementById(
            "saldoContasResumo"
        )
        .textContent =
        formatarDinheiro(
            saldoTotal
        );


    document
        .getElementById(
            "saldoInicialResumo"
        )
        .textContent =
        formatarDinheiro(
            saldoInicial
        );


    document
        .getElementById(
            "saldoPrevisto"
        )
        .textContent =
        formatarDinheiro(
            saldoTotal
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


// ================================
// FILTROS
// ================================

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


    const lista =
        transacoesDoMes()
            .filter(
                function(item) {

                    const textoOk =
                        (
                            item.descricao ||
                            ""
                        )
                        .toLowerCase()
                        .includes(
                            texto
                        );


                    const tipoOk =
                        tipo ===
                            "todos"
                        ||
                        item.tipo ===
                            tipo;


                    return (
                        textoOk &&
                        tipoOk
                    );

                }
            );


    mostrarLancamentos(
        lista
    );

}


document
    .getElementById(
        "buscaTransacao"
    )
    .oninput =
    aplicarFiltros;


document
    .getElementById(
        "filtroTipo"
    )
    .onchange =
    aplicarFiltros;


// ================================
// CARREGAR
// ================================

async function carregarDados() {

    contasCache =
        await buscarContas();


    transacoesCache =
        await buscarTransacoes();


    mostrarContas();

    mostrarLancamentos();

    mostrarUltimos();

    atualizarResumo();

}


// ================================
// UTILIDADES
// ================================

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


// ================================
// INICIAR
// ================================

async function iniciar() {

    atualizarMes();


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