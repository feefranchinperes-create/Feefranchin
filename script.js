const SUPABASE_URL =
    "https://ibqrxueyxrresvarfggm.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_K9BnZiIWoPCsxcP93FHL7g_vswpNF8r";

// ========================================================
// MINHAS FINANÇAS
// SCRIPT COMPLETO
// ========================================================

// COLOQUE AQUI OS MESMOS DADOS QUE JÁ ESTAVAM NO SEU SCRIPT


const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// ========================================================
// ESTADO
// ========================================================

let contasCache = [];
let transacoesCache = [];
let categoriasCache = [];
let tagsCache = [];
let relacoesTagsCache = [];

let transacaoEditandoId = null;

let dataAtual = new Date();

let mesAtual = dataAtual.getMonth();
let anoAtual = dataAtual.getFullYear();


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


// ========================================================
// ELEMENTOS
// ========================================================

const telaLogin =
    document.getElementById("telaLogin");

const telaCadastro =
    document.getElementById("telaCadastro");

const sistema =
    document.getElementById("sistema");

const menuLateral =
    document.getElementById("menuLateral");

const menuOverlay =
    document.getElementById("menuOverlay");

const menuMais =
    document.getElementById("menuMais");

const areaFormularioConta =
    document.getElementById("areaFormularioConta");

const areaFormularioTransacao =
    document.getElementById("areaFormularioTransacao");


// ========================================================
// UTILIDADES
// ========================================================

function formatarDinheiro(valor) {

    return Number(valor || 0)
        .toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );
}


function hoje() {

    const data = new Date();

    const ano = data.getFullYear();

    const mes =
        String(
            data.getMonth() + 1
        ).padStart(2, "0");

    const dia =
        String(
            data.getDate()
        ).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
}


function formatarData(data) {

    if (!data) {
        return "";
    }

    const partes =
        data.split("-");

    if (partes.length !== 3) {
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


function escaparHTML(texto) {

    return String(texto || "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


function numero(valor) {

    return Number(valor || 0);
}


function estaEfetivada(item) {

    if (
        item.efetivada === true
    ) {
        return true;
    }

    if (
        item.status === "efetivada"
    ) {
        return true;
    }

    return false;
}


function estaPendente(item) {

    return !estaEfetivada(item);
}


function estaVencida(item) {

    if (!estaPendente(item)) {
        return false;
    }

    if (!item.data_vencimento) {
        return false;
    }

    return (
        item.data_vencimento <
        hoje()
    );
}


function dataReferencia(item) {

    return (
        item.data_vencimento ||
        item.data
    );
}


function pertenceAoMes(item) {

    const data =
        dataReferencia(item);

    if (!data) {
        return false;
    }

    const partes =
        data.split("-");

    if (partes.length < 2) {
        return false;
    }

    const ano =
        Number(partes[0]);

    const mes =
        Number(partes[1]) - 1;

    return (
        ano === anoAtual &&
        mes === mesAtual
    );
}


function transacoesDoMes() {

    return transacoesCache
        .filter(pertenceAoMes);
}


// ========================================================
// LOGIN
// ========================================================

function mostrarLogin() {

    telaLogin
        .classList
        .remove("oculto");

    telaCadastro
        .classList
        .add("oculto");

    sistema
        .classList
        .add("oculto");
}


function mostrarCadastro() {

    telaLogin
        .classList
        .add("oculto");

    telaCadastro
        .classList
        .remove("oculto");

    sistema
        .classList
        .add("oculto");
}


function mostrarSistema() {

    telaLogin
        .classList
        .add("oculto");

    telaCadastro
        .classList
        .add("oculto");

    sistema
        .classList
        .remove("oculto");
}


document
    .getElementById("btnMostrarCadastro")
    .addEventListener(
        "click",
        mostrarCadastro
    );


document
    .getElementById("btnVoltarLogin")
    .addEventListener(
        "click",
        mostrarLogin
    );


document
    .getElementById("formCadastro")
    .addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();

            const email =
                document
                    .getElementById("emailCadastro")
                    .value
                    .trim();

            const password =
                document
                    .getElementById("senhaCadastro")
                    .value;

            const mensagem =
                document
                    .getElementById("mensagemCadastro");


            mensagem.textContent =
                "Cadastrando...";


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


document
    .getElementById("formLogin")
    .addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();

            const email =
                document
                    .getElementById("emailLogin")
                    .value
                    .trim();

            const password =
                document
                    .getElementById("senhaLogin")
                    .value;

            const mensagem =
                document
                    .getElementById("mensagemLogin");


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


document
    .getElementById("btnSair")
    .addEventListener(
        "click",
        async function() {

            await supabaseClient
                .auth
                .signOut();

            mostrarLogin();
        }
    );


async function pegarUsuario() {

    const { data } =
        await supabaseClient
            .auth
            .getUser();

    return data.user;
}


function atualizarUsuario(usuario) {

    if (!usuario) {
        return;
    }

    document
        .getElementById("emailUsuario")
        .textContent =
        usuario.email || "";
}


// ========================================================
// MENU
// ========================================================

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
    .getElementById("btnMenu")
    .addEventListener(
        "click",
        abrirMenu
    );


menuOverlay
    .addEventListener(
        "click",
        fecharMenu
    );


const titulosPaginas = {

    inicio:
        "Resumo",

    contas:
        "Contas",

    transacoes:
        "Transações",

    categorias:
        "Plano de contas"
};


function abrirPagina(nome) {

    document
        .querySelectorAll(".pagina")
        .forEach(
            pagina => {

                pagina
                    .classList
                    .remove("ativa");

            }
        );


    const pagina =
        document
            .getElementById(nome);


    if (pagina) {

        pagina
            .classList
            .add("ativa");

    }


    document
        .querySelectorAll(
            "[data-pagina]"
        )
        .forEach(
            botao => {

                botao
                    .classList
                    .toggle(
                        "ativo",
                        botao
                            .dataset
                            .pagina === nome
                    );

            }
        );


    document
        .getElementById("tituloPagina")
        .textContent =
        titulosPaginas[nome] ||
        "Minhas Finanças";


    const btnMais =
        document
            .getElementById("btnMais");


    btnMais.style.display =
        nome === "inicio"
            ? "block"
            : "none";


    menuMais
        .classList
        .add("oculto");


    fecharMenu();
}


document
    .querySelectorAll(
        "[data-pagina]"
    )
    .forEach(
        botao => {

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


document
    .getElementById("btnVerContas")
    .addEventListener(
        "click",
        () =>
            abrirPagina("contas")
    );


document
    .getElementById("btnVerTransacoes")
    .addEventListener(
        "click",
        () =>
            abrirPagina("transacoes")
    );


document
    .getElementById("btnVerCategorias")
    .addEventListener(
        "click",
        () =>
            abrirPagina("categorias")
    );


// ========================================================
// MÊS
// ========================================================

function atualizarNomeMes() {

    document
        .getElementById("nomeMes")
        .textContent =
        meses[mesAtual] +
        " " +
        anoAtual;
}


document
    .getElementById("mesAnterior")
    .addEventListener(
        "click",
        function() {

            mesAtual--;

            if (mesAtual < 0) {

                mesAtual = 11;
                anoAtual--;
            }

            atualizarNomeMes();

            atualizarInterface();
        }
    );


document
    .getElementById("mesSeguinte")
    .addEventListener(
        "click",
        function() {

            mesAtual++;

            if (mesAtual > 11) {

                mesAtual = 0;
                anoAtual++;
            }

            atualizarNomeMes();

            atualizarInterface();
        }
    );


// ========================================================
// BOTÃO +
// ========================================================

document
    .getElementById("btnMais")
    .addEventListener(
        "click",
        function() {

            menuMais
                .classList
                .toggle("oculto");
        }
    );


document
    .getElementById("btnReceitaRapida")
    .addEventListener(
        "click",
        function() {

            menuMais
                .classList
                .add("oculto");

            abrirFormularioTransacao(
                "receita"
            );
        }
    );


document
    .getElementById("btnDespesaRapida")
    .addEventListener(
        "click",
        function() {

            menuMais
                .classList
                .add("oculto");

            abrirFormularioTransacao(
                "despesa"
            );
        }
    );


document
    .getElementById("btnContaRapida")
    .addEventListener(
        "click",
        function() {

            menuMais
                .classList
                .add("oculto");

            abrirPagina("contas");

            areaFormularioConta
                .classList
                .remove("oculto");
        }
    );


// ========================================================
// CONTAS
// ========================================================

document
    .getElementById("btnNovaConta")
    .addEventListener(
        "click",
        function() {

            areaFormularioConta
                .classList
                .remove("oculto");
        }
    );


document
    .getElementById("btnCancelarConta")
    .addEventListener(
        "click",
        function() {

            areaFormularioConta
                .classList
                .add("oculto");
        }
    );


document
    .getElementById("formConta")
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
                    .getElementById("nomeConta")
                    .value
                    .trim();

            const tipo =
                document
                    .getElementById("tipoConta")
                    .value;

            const saldoInicial =
                numero(
                    document
                        .getElementById("saldoInicial")
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
                    .getElementById("mensagemConta")
                    .textContent =
                    "Erro: " +
                    error.message;

                return;
            }


            document
                .getElementById("mensagemConta")
                .textContent = "";


            event.target.reset();

            document
                .getElementById("saldoInicial")
                .value = 0;


            areaFormularioConta
                .classList
                .add("oculto");


            await carregarDados();
        }
    );


// ========================================================
// CATEGORIAS / PLANO DE CONTAS
// ========================================================

document
    .getElementById("formCategoria")
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
                    .getElementById("nomeCategoria")
                    .value
                    .trim();

            const tipo =
                document
                    .getElementById("tipoCategoria")
                    .value;


            if (!nome) {
                return;
            }


            const { error } =
                await supabaseClient
                    .from("categorias")
                    .insert([
                        {
                            user_id:
                                usuario.id,

                            nome,

                            tipo,

                            ativo:
                                true
                        }
                    ]);


            if (error) {

                alert(
                    "Erro ao criar categoria: " +
                    error.message
                );

                return;
            }


            event.target.reset();

            await carregarDados();
        }
    );


// ========================================================
// TRANSAÇÕES
// ========================================================

function preencherStatus(tipo) {

    const campo =
        document
            .getElementById("status");


    if (
        tipo === "receita"
    ) {

        campo.innerHTML = `

            <option value="pendente">
                A receber
            </option>

            <option value="efetivada">
                Recebida
            </option>

        `;

    } else {

        campo.innerHTML = `

            <option value="pendente">
                A pagar
            </option>

            <option value="efetivada">
                Paga
            </option>

        `;
    }
}


document
    .getElementById("tipo")
    .addEventListener(
        "change",
        function() {

            preencherStatus(
                this.value
            );

            preencherCategoriasSelect(
                this.value
            );
        }
    );


function limparFormularioTransacao() {

    transacaoEditandoId = null;

    const form =
        document
            .getElementById("formTransacao");

    form.reset();

    document
        .getElementById("data")
        .value =
        hoje();

    document
        .getElementById("dataVencimento")
        .value =
        hoje();

    document
        .getElementById("dataPagamento")
        .value = "";

    document
        .getElementById("observacao")
        .value = "";

    document
        .getElementById("tagsTransacao")
        .value = "";

    document
        .getElementById("mensagemTransacao")
        .textContent = "";
}


function abrirFormularioTransacao(
    tipo = "",
    item = null
) {

    abrirPagina("transacoes");

    areaFormularioTransacao
        .classList
        .remove("oculto");


    limparFormularioTransacao();


    if (item) {

        transacaoEditandoId =
            item.id;

        document
            .getElementById("tituloFormTransacao")
            .textContent =
            "Editar lançamento";


        document
            .getElementById("descricao")
            .value =
            item.descricao || "";


        document
            .getElementById("valor")
            .value =
            numero(item.valor);


        document
            .getElementById("tipo")
            .value =
            item.tipo;


        preencherStatus(
            item.tipo
        );


        document
            .getElementById("status")
            .value =
            estaEfetivada(item)
                ? "efetivada"
                : "pendente";


        document
            .getElementById("data")
            .value =
            item.data || hoje();


        document
            .getElementById("dataVencimento")
            .value =
            item.data_vencimento || "";


        document
            .getElementById("dataPagamento")
            .value =
            item.data_pagamento || "";


        document
            .getElementById("contaTransacao")
            .value =
            item.conta_id || "";


        preencherCategoriasSelect(
            item.tipo
        );


        document
            .getElementById("categoriaTransacao")
            .value =
            item.categoria_id || "";


        document
            .getElementById("observacao")
            .value =
            item.observacao || "";


        document
            .getElementById("tagsTransacao")
            .value =
            nomesTagsDaTransacao(
                item.id
            )
            .join(", ");


        return;
    }


    document
        .getElementById("tituloFormTransacao")
        .textContent =
        tipo === "receita"
            ? "Nova Receita"
            : tipo === "despesa"
            ? "Nova Despesa"
            : "Novo lançamento";


    if (tipo) {

        document
            .getElementById("tipo")
            .value =
            tipo;

        preencherStatus(tipo);

        preencherCategoriasSelect(
            tipo
        );
    }
}


document
    .getElementById("btnNovaTransacao")
    .addEventListener(
        "click",
        function() {

            abrirFormularioTransacao();
        }
    );


document
    .getElementById("btnCancelarTransacao")
    .addEventListener(
        "click",
        function() {

            areaFormularioTransacao
                .classList
                .add("oculto");

            transacaoEditandoId = null;
        }
    );


document
    .getElementById("formTransacao")
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
                    .getElementById("descricao")
                    .value
                    .trim();


            const valor =
                numero(
                    document
                        .getElementById("valor")
                        .value
                );


            const tipo =
                document
                    .getElementById("tipo")
                    .value;


            const status =
                document
                    .getElementById("status")
                    .value;


            const data =
                document
                    .getElementById("data")
                    .value;


            const dataVencimento =
                document
                    .getElementById("dataVencimento")
                    .value || null;


            let dataPagamento =
                document
                    .getElementById("dataPagamento")
                    .value || null;


            const contaId =
                Number(
                    document
                        .getElementById("contaTransacao")
                        .value
                );


            const categoriaValor =
                document
                    .getElementById("categoriaTransacao")
                    .value;


            const categoriaId =
                categoriaValor
                    ? Number(categoriaValor)
                    : null;


            const observacao =
                document
                    .getElementById("observacao")
                    .value
                    .trim();


            const efetivada =
                status === "efetivada";


            if (
                efetivada &&
                !dataPagamento
            ) {

                dataPagamento =
                    hoje();
            }


            if (!efetivada) {

                dataPagamento = null;
            }


            const registro = {

                descricao,
                valor,
                tipo,
                data,

                conta_id:
                    contaId,

                status,

                efetivada,

                data_vencimento:
                    dataVencimento,

                data_pagamento:
                    dataPagamento,

                observacao:

                    observacao ||
                    null,

                categoria_id:
                    categoriaId,

                user_id:
                    usuario.id
            };


            let transacaoId =
                transacaoEditandoId;


            if (
                transacaoEditandoId
            ) {

                const { error } =
                    await supabaseClient
                        .from("transacoes")
                        .update(registro)
                        .eq(
                            "id",
                            transacaoEditandoId
                        );


                if (error) {

                    mostrarErroTransacao(
                        error
                    );

                    return;
                }

            } else {

                const {
                    data: inserida,
                    error
                } =
                    await supabaseClient
                        .from("transacoes")
                        .insert([
                            registro
                        ])
                        .select("id")
                        .single();


                if (error) {

                    mostrarErroTransacao(
                        error
                    );

                    return;
                }


                transacaoId =
                    inserida.id;
            }


            const textoTags =
                document
                    .getElementById("tagsTransacao")
                    .value;


            await salvarTagsDaTransacao(
                transacaoId,
                textoTags,
                usuario.id
            );


            areaFormularioTransacao
                .classList
                .add("oculto");


            transacaoEditandoId =
                null;


            await carregarDados();
        }
    );


function mostrarErroTransacao(
    error
) {

    console.error(error);

    document
        .getElementById("mensagemTransacao")
        .textContent =
        "Erro: " +
        error.message;
}


// ========================================================
// TAGS
// ========================================================

function limparNomeTag(nome) {

    return nome
        .trim()
        .replace(/\s+/g, " ");
}


async function salvarTagsDaTransacao(
    transacaoId,
    texto,
    usuarioId
) {

    await supabaseClient
        .from("transacao_tags")
        .delete()
        .eq(
            "transacao_id",
            transacaoId
        );


    const nomes =
        [
            ...new Set(
                texto
                    .split(",")
                    .map(limparNomeTag)
                    .filter(Boolean)
            )
        ];


    for (
        const nome
        of nomes
    ) {

        let tag =
            tagsCache.find(
                item =>
                    item.nome
                        .toLowerCase() ===
                    nome.toLowerCase()
            );


        if (!tag) {

            const {
                data,
                error
            } =
                await supabaseClient
                    .from("tags")
                    .insert([
                        {
                            user_id:
                                usuarioId,

                            nome
                        }
                    ])
                    .select("*")
                    .single();


            if (error) {

                console.error(
                    error
                );

                continue;
            }


            tag = data;

            tagsCache.push(
                tag
            );
        }


        await supabaseClient
            .from("transacao_tags")
            .insert([
                {
                    user_id:
                        usuarioId,

                    transacao_id:
                        transacaoId,

                    tag_id:
                        tag.id
                }
            ]);
    }
}


function nomesTagsDaTransacao(
    transacaoId
) {

    const ids =
        relacoesTagsCache
            .filter(
                item =>
                    Number(
                        item.transacao_id
                    ) ===
                    Number(
                        transacaoId
                    )
            )
            .map(
                item =>
                    Number(
                        item.tag_id
                    )
            );


    return tagsCache
        .filter(
            tag =>
                ids.includes(
                    Number(
                        tag.id
                    )
                )
        )
        .map(
            tag =>
                tag.nome
        );
}


// ========================================================
// BUSCAR DADOS
// ========================================================

async function buscarContas() {

    const { data, error } =
        await supabaseClient
            .from("Contas")
            .select("*")
            .order("nome");


    if (error) {

        console.error(
            "Erro contas:",
            error
        );

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
            )
            .order(
                "id",
                {
                    ascending:
                        false
                }
            );


    if (error) {

        console.error(
            "Erro transações:",
            error
        );

        return [];
    }


    return data || [];
}


async function buscarCategorias() {

    const { data, error } =
        await supabaseClient
            .from("categorias")
            .select("*")
            .eq(
                "ativo",
                true
            )
            .order("nome");


    if (error) {

        console.error(
            "Erro categorias:",
            error
        );

        return [];
    }


    return data || [];
}


async function buscarTags() {

    const { data, error } =
        await supabaseClient
            .from("tags")
            .select("*")
            .order("nome");


    if (error) {

        console.error(
            "Erro tags:",
            error
        );

        return [];
    }


    return data || [];
}


async function buscarRelacoesTags() {

    const { data, error } =
        await supabaseClient
            .from("transacao_tags")
            .select("*");


    if (error) {

        console.error(
            "Erro relações tags:",
            error
        );

        return [];
    }


    return data || [];
}


// ========================================================
// CÁLCULOS
// ========================================================

function saldoInicialTotal() {

    return contasCache
        .reduce(
            (
                total,
                conta
            ) =>
                total +
                numero(
                    conta.saldo_inicial
                ),
            0
        );
}


function saldoAtualTotal() {

    let saldo =
        saldoInicialTotal();


    transacoesCache
        .filter(estaEfetivada)
        .forEach(
            item => {

                const valor =
                    numero(item.valor);

                if (
                    item.tipo ===
                    "receita"
                ) {

                    saldo += valor;

                } else if (
                    item.tipo ===
                    "despesa"
                ) {

                    saldo -= valor;
                }

            }
        );


    return saldo;
}


function saldoConta(contaId) {

    const conta =
        contasCache.find(
            item =>
                Number(item.id) ===
                Number(contaId)
        );


    if (!conta) {
        return 0;
    }


    let saldo =
        numero(
            conta.saldo_inicial
        );


    transacoesCache
        .filter(
            item =>
                Number(
                    item.conta_id
                ) ===
                    Number(contaId)
                &&
                estaEfetivada(item)
        )
        .forEach(
            item => {

                if (
                    item.tipo ===
                    "receita"
                ) {

                    saldo +=
                        numero(
                            item.valor
                        );

                } else if (
                    item.tipo ===
                    "despesa"
                ) {

                    saldo -=
                        numero(
                            item.valor
                        );
                }

            }
        );


    return saldo;
}


// ========================================================
// RESUMO
// ========================================================

function atualizarResumo() {

    const listaMes =
        transacoesDoMes();


    let receitasEfetivadas = 0;
    let despesasEfetivadas = 0;

    let aReceber = 0;
    let aPagar = 0;
    let vencidas = 0;


    listaMes.forEach(
        item => {

            const valor =
                numero(item.valor);


            if (
                estaEfetivada(item)
            ) {

                if (
                    item.tipo ===
                    "receita"
                ) {

                    receitasEfetivadas +=
                        valor;

                } else if (
                    item.tipo ===
                    "despesa"
                ) {

                    despesasEfetivadas +=
                        valor;
                }

            } else {

                if (
                    item.tipo ===
                    "receita"
                ) {

                    aReceber +=
                        valor;

                } else if (
                    item.tipo ===
                    "despesa"
                ) {

                    aPagar +=
                        valor;


                    if (
                        estaVencida(item)
                    ) {

                        vencidas +=
                            valor;
                    }
                }

            }

        }
    );


    const saldoAtual =
        saldoAtualTotal();


    const saldoPrevisto =
        saldoAtual
        +
        aReceber
        -
        aPagar;


    document
        .getElementById("saldoTotal")
        .textContent =
        formatarDinheiro(
            saldoAtual
        );


    document
        .getElementById("saldoCabecalho")
        .textContent =
        formatarDinheiro(
            saldoAtual
        );


    document
        .getElementById("totalAReceber")
        .textContent =
        formatarDinheiro(
            aReceber
        );


    document
        .getElementById("totalAPagar")
        .textContent =
        formatarDinheiro(
            aPagar
        );


    document
        .getElementById("totalVencido")
        .textContent =
        formatarDinheiro(
            vencidas
        );


    document
        .getElementById("saldoPrevisto")
        .textContent =
        formatarDinheiro(
            saldoPrevisto
        );


    document
        .getElementById("totalReceitas")
        .textContent =
        formatarDinheiro(
            receitasEfetivadas
        );


    document
        .getElementById("totalDespesas")
        .textContent =
        formatarDinheiro(
            despesasEfetivadas
        );
}


// ========================================================
// CONTAS NA TELA
// ========================================================

function mostrarContas() {

    const areaInicio =
        document
            .getElementById("contasInicio");


    const areaPagina =
        document
            .getElementById("listaContas");


    const select =
        document
            .getElementById("contaTransacao");


    areaInicio.innerHTML = "";
    areaPagina.innerHTML = "";


    select.innerHTML = `

        <option value="">
            Selecione uma conta
        </option>

    `;


    contasCache.forEach(
        conta => {

            const saldo =
                saldoConta(
                    conta.id
                );


            const classe =
                saldo < 0
                    ? "saldo-negativo"
                    : "saldo-positivo";


            const inicial =
                escaparHTML(
                    (
                        conta.nome ||
                        "C"
                    )
                    .charAt(0)
                    .toUpperCase()
                );


            const nome =
                escaparHTML(
                    conta.nome
                );


            const tipo =
                escaparHTML(
                    conta.tipo || ""
                );


            const html = `

                <div class="conta-resumo">

                    <div class="icone-conta">
                        ${inicial}
                    </div>

                    <div class="conta-info">

                        <strong>
                            ${nome}
                        </strong>

                        <small>
                            ${tipo}
                        </small>

                    </div>

                    <strong
                        class="valor-conta ${classe}"
                    >
                        ${formatarDinheiro(
                            saldo
                        )}
                    </strong>

                </div>

            `;


            areaInicio
                .insertAdjacentHTML(
                    "beforeend",
                    html
                );


            areaPagina
                .insertAdjacentHTML(
                    "beforeend",
                    `

                    <article class="conta-pagina">

                        <div class="icone-conta">
                            ${inicial}
                        </div>

                        <div class="conta-info">

                            <strong>
                                ${nome}
                            </strong>

                            <small>
                                ${tipo}
                            </small>

                        </div>

                        <strong
                            class="valor-conta ${classe}"
                        >
                            ${formatarDinheiro(
                                saldo
                            )}
                        </strong>

                    </article>

                    `
                );


            const option =
                document
                    .createElement(
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


// ========================================================
// CATEGORIAS
// ========================================================

function preencherCategoriasSelect(
    tipo = ""
) {

    const select =
        document
            .getElementById(
                "categoriaTransacao"
            );


    const atual =
        select.value;


    select.innerHTML = `

        <option value="">
            Sem categoria
        </option>

    `;


    categoriasCache
        .filter(
            categoria =>
                !tipo ||
                categoria.tipo === tipo
        )
        .forEach(
            categoria => {

                const option =
                    document
                        .createElement(
                            "option"
                        );


                option.value =
                    categoria.id;

                option.textContent =
                    categoria.nome;


                select.appendChild(
                    option
                );
            }
        );


    if (
        [
            ...select.options
        ]
        .some(
            option =>
                option.value ===
                atual
        )
    ) {

        select.value =
            atual;
    }
}


function nomeCategoria(id) {

    const categoria =
        categoriasCache.find(
            item =>
                Number(item.id) ===
                Number(id)
        );


    return categoria
        ? categoria.nome
        : "Sem categoria";
}


function mostrarCategorias() {

    const area =
        document
            .getElementById(
                "listaCategorias"
            );


    area.innerHTML = "";


    if (
        categoriasCache.length === 0
    ) {

        area.innerHTML = `
            <p>
                Nenhuma categoria cadastrada.
            </p>
        `;

        return;
    }


    categoriasCache.forEach(
        categoria => {

            const tipo =
                categoria.tipo ===
                    "receita"
                    ? "Receita"
                    : "Despesa";


            area.insertAdjacentHTML(
                "beforeend",
                `

                <div class="categoria-item">

                    <div>

                        <strong>
                            ${escaparHTML(
                                categoria.nome
                            )}
                        </strong>

                        <div class="categoria-tipo">
                            ${tipo}
                        </div>

                    </div>

                </div>

                `
            );
        }
    );


    preencherCategoriasSelect(
        document
            .getElementById("tipo")
            .value
    );
}


// ========================================================
// FATURAMENTO / CATEGORIAS
// ========================================================

function mostrarResumoCategorias() {

    const area =
        document
            .getElementById(
                "resumoCategorias"
            );


    area.innerHTML = "";


    const movimentos =
        transacoesDoMes()
            .filter(
                estaEfetivada
            );


    const totais =
        new Map();


    movimentos.forEach(
        item => {

            const chave =
                item.categoria_id
                    ? String(
                        item.categoria_id
                    )
                    : "sem";


            if (
                !totais.has(chave)
            ) {

                totais.set(
                    chave,
                    {
                        receitas: 0,
                        despesas: 0
                    }
                );
            }


            const registro =
                totais.get(chave);


            if (
                item.tipo ===
                "receita"
            ) {

                registro.receitas +=
                    numero(item.valor);

            } else {

                registro.despesas +=
                    numero(item.valor);
            }
        }
    );


    if (
        totais.size === 0
    ) {

        area.innerHTML = `
            <p>
                Ainda não há movimentações
                categorizadas neste mês.
            </p>
        `;

        return;
    }


    totais.forEach(
        (
            valores,
            chave
        ) => {

            const nome =
                chave === "sem"
                    ? "Sem categoria"
                    : nomeCategoria(
                        chave
                    );


            area.insertAdjacentHTML(
                "beforeend",
                `

                <div class="resumo-categoria">

                    <div>

                        <strong>
                            ${escaparHTML(nome)}
                        </strong>

                        <small>
                            Receita:
                            ${formatarDinheiro(
                                valores.receitas
                            )}

                            ·

                            Despesa:
                            ${formatarDinheiro(
                                valores.despesas
                            )}
                        </small>

                    </div>

                    <strong>
                        ${formatarDinheiro(
                            valores.receitas
                            -
                            valores.despesas
                        )}
                    </strong>

                </div>

                `
            );
        }
    );
}


// ========================================================
// LANÇAMENTOS
// ========================================================

function nomeConta(id) {

    const conta =
        contasCache.find(
            item =>
                Number(item.id) ===
                Number(id)
        );


    return conta
        ? conta.nome
        : "Conta";
}


function statusDoItem(item) {

    if (
        estaVencida(item)
    ) {

        return {
            texto:
                "Vencida",

            classe:
                "badge-vencido"
        };
    }


    if (
        estaEfetivada(item)
    ) {

        return {

            texto:
                item.tipo ===
                    "receita"
                    ? "Recebida"
                    : "Paga",

            classe:
                "badge-pago"
        };
    }


    return {

        texto:
            item.tipo ===
                "receita"
                ? "A receber"
                : "A pagar",

        classe:
            "badge-pendente"
    };
}


function htmlLancamento(
    item,
    comAcoes = true
) {

    const despesa =
        item.tipo ===
        "despesa";


    const status =
        statusDoItem(item);


    const tags =
        nomesTagsDaTransacao(
            item.id
        );


    const categoria =
        nomeCategoria(
            item.categoria_id
        );


    const descricao =
        escaparHTML(
            item.descricao
        );


    const observacao =
        item.observacao
            ? escaparHTML(
                item.observacao
            )
            : "";


    let complemento = `

        <small>

            ${escaparHTML(
                nomeConta(
                    item.conta_id
                )
            )}

            ·

            ${escaparHTML(
                categoria
            )}

        </small>

    `;


    if (tags.length) {

        complemento += `

            <small>
                #${tags
                    .map(escaparHTML)
                    .join(" #")}
            </small>

        `;
    }


    if (observacao) {

        complemento += `

            <small>
                ${observacao}
            </small>

        `;
    }


    let acoes = "";


    if (comAcoes) {

        acoes = `

            <div class="acoes-lancamento">

                <button
                    type="button"
                    class="btn-editar"
                    data-acao="editar"
                    data-id="${item.id}"
                >
                    Editar
                </button>

                ${
                    estaPendente(item)
                        ? `

                        <button
                            type="button"
                            class="btn-efetivar"
                            data-acao="efetivar"
                            data-id="${item.id}"
                        >

                            ${
                                item.tipo ===
                                "receita"
                                    ? "Receber"
                                    : "Pagar"
                            }

                        </button>

                        `
                        : ""
                }

                <button
                    type="button"
                    class="btn-excluir"
                    data-acao="excluir"
                    data-id="${item.id}"
                >
                    Excluir
                </button>

            </div>

        `;
    }


    return `

        <div class="lancamento">

            <div
                class="icone-lancamento ${
                    despesa
                        ? "despesa"
                        : "receita"
                }"
            >

                ${
                    despesa
                        ? "−"
                        : "+"
                }

            </div>


            <div class="lancamento-info">

                <strong>
                    ${descricao}
                </strong>

                ${complemento}

                <span
                    class="badge-status ${
                        status.classe
                    }"
                >
                    ${status.texto}
                </span>

                ${acoes}

            </div>


            <div class="lancamento-valor">

                <strong
                    class="${
                        despesa
                            ? "saldo-negativo"
                            : "saldo-positivo"
                    }"
                >

                    ${
                        despesa
                            ? "− "
                            : "+ "
                    }

                    ${formatarDinheiro(
                        item.valor
                    )}

                </strong>


                <small>

                    ${
                        item.data_vencimento
                            ? "Venc. " +
                              formatarData(
                                  item.data_vencimento
                              )
                            : formatarData(
                                  item.data
                              )
                    }

                </small>

            </div>

        </div>

    `;
}


function mostrarLancamentos(
    lista = null
) {

    const area =
        document
            .getElementById(
                "listaTransacoes"
            );


    const dados =
        lista ||
        transacoesDoMes();


    area.innerHTML = "";


    if (
        dados.length === 0
    ) {

        area.innerHTML = `
            <div class="card-app">
                Nenhum lançamento neste mês.
            </div>
        `;

        return;
    }


    dados.forEach(
        item => {

            area.insertAdjacentHTML(
                "beforeend",
                htmlLancamento(
                    item,
                    true
                )
            );
        }
    );
}


function mostrarUltimosLancamentos() {

    const area =
        document
            .getElementById(
                "ultimosLancamentos"
            );


    area.innerHTML = "";


    const lista =
        transacoesDoMes()
            .slice(0, 5);


    if (
        lista.length === 0
    ) {

        area.innerHTML = `
            <p>
                Nenhum lançamento neste mês.
            </p>
        `;

        return;
    }


    lista.forEach(
        item => {

            area.insertAdjacentHTML(
                "beforeend",
                htmlLancamento(
                    item,
                    false
                )
            );
        }
    );
}


// ========================================================
// AÇÕES DOS LANÇAMENTOS
// ========================================================

document
    .getElementById("listaTransacoes")
    .addEventListener(
        "click",
        async function(event) {

            const botao =
                event.target.closest(
                    "[data-acao]"
                );


            if (!botao) {
                return;
            }


            const id =
                Number(
                    botao.dataset.id
                );


            const item =
                transacoesCache.find(
                    item =>
                        Number(item.id) === id
                );


            if (!item) {
                return;
            }


            const acao =
                botao.dataset.acao;


            if (
                acao === "editar"
            ) {

                abrirFormularioTransacao(
                    item.tipo,
                    item
                );

                return;
            }


            if (
                acao === "efetivar"
            ) {

                await efetivarTransacao(
                    item
                );

                return;
            }


            if (
                acao === "excluir"
            ) {

                await excluirTransacao(
                    item
                );
            }
        }
    );


async function efetivarTransacao(
    item
) {

    const texto =
        item.tipo ===
            "receita"
            ? "Marcar esta receita como recebida?"
            : "Marcar esta despesa como paga?";


    if (
        !confirm(texto)
    ) {
        return;
    }


    const { error } =
        await supabaseClient
            .from("transacoes")
            .update({
                status:
                    "efetivada",

                efetivada:
                    true,

                data_pagamento:
                    hoje()
            })
            .eq(
                "id",
                item.id
            );


    if (error) {

        alert(
            "Erro: " +
            error.message
        );

        return;
    }


    await carregarDados();
}


async function excluirTransacao(
    item
) {

    if (
        !confirm(
            `Excluir "${item.descricao}"?`
        )
    ) {
        return;
    }


    await supabaseClient
        .from("transacao_tags")
        .delete()
        .eq(
            "transacao_id",
            item.id
        );


    const { error } =
        await supabaseClient
            .from("transacoes")
            .delete()
            .eq(
                "id",
                item.id
            );


    if (error) {

        alert(
            "Não foi possível excluir: " +
            error.message
        );

        return;
    }


    await carregarDados();
}


// ========================================================
// FILTROS
// ========================================================

function aplicarFiltros() {

    const busca =
        document
            .getElementById("buscaTransacao")
            .value
            .trim()
            .toLowerCase();


    const tipo =
        document
            .getElementById("filtroTipo")
            .value;


    const status =
        document
            .getElementById("filtroStatus")
            .value;


    const lista =
        transacoesDoMes()
            .filter(
                item => {

                    const buscaOk =
                        !busca
                        ||
                        String(
                            item.descricao ||
                            ""
                        )
                        .toLowerCase()
                        .includes(busca)
                        ||
                        String(
                            item.observacao ||
                            ""
                        )
                        .toLowerCase()
                        .includes(busca)
                        ||
                        nomeCategoria(
                            item.categoria_id
                        )
                        .toLowerCase()
                        .includes(busca)
                        ||
                        nomesTagsDaTransacao(
                            item.id
                        )
                        .some(
                            tag =>
                                tag
                                    .toLowerCase()
                                    .includes(
                                        busca
                                    )
                        );


                    const tipoOk =
                        tipo === "todos"
                        ||
                        item.tipo === tipo;


                    let statusOk =
                        true;


                    if (
                        status ===
                        "pendente"
                    ) {

                        statusOk =
                            estaPendente(
                                item
                            );

                    } else if (
                        status ===
                        "efetivada"
                    ) {

                        statusOk =
                            estaEfetivada(
                                item
                            );
                    }


                    return (
                        buscaOk &&
                        tipoOk &&
                        statusOk
                    );
                }
            );


    mostrarLancamentos(
        lista
    );
}


document
    .getElementById("buscaTransacao")
    .addEventListener(
        "input",
        aplicarFiltros
    );


document
    .getElementById("filtroTipo")
    .addEventListener(
        "change",
        aplicarFiltros
    );


document
    .getElementById("filtroStatus")
    .addEventListener(
        "change",
        aplicarFiltros
    );


// ========================================================
// ATUALIZAR INTERFACE
// ========================================================

function atualizarInterface() {

    atualizarNomeMes();

    atualizarResumo();

    mostrarContas();

    mostrarCategorias();

    mostrarResumoCategorias();

    mostrarLancamentos();

    mostrarUltimosLancamentos();
}


// ========================================================
// CARREGAR TUDO
// ========================================================

async function carregarDados() {

    const resultados =
        await Promise.all([
            buscarContas(),
            buscarTransacoes(),
            buscarCategorias(),
            buscarTags(),
            buscarRelacoesTags()
        ]);


    contasCache =
        resultados[0];

    transacoesCache =
        resultados[1];

    categoriasCache =
        resultados[2];

    tagsCache =
        resultados[3];

    relacoesTagsCache =
        resultados[4];


    atualizarInterface();
}


// ========================================================
// INICIAR
// ========================================================

async function iniciar() {

    atualizarNomeMes();


    document
        .getElementById("data")
        .value =
        hoje();


    document
        .getElementById("dataVencimento")
        .value =
        hoje();


    preencherStatus(
        "despesa"
    );


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

        abrirPagina("inicio");

        await carregarDados();

    } else {

        mostrarLogin();
    }
}


iniciar();