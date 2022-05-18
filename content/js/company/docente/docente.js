(function () {

    /** criar scop para variaves do painel student */
    (page.painel || {}).docente = {};

    var docente = page.painel.docente;

    docente.method = () => {
        return page.proto(
            {
                GetUtilizadores: function (b) {
                    return this.execute("sys/rest/GetUtilizadores", b || {});
                },
                set: function (b) {
                    return this.execute("sys/rest/Utilizadores", b || {});
                },
                update: function (b) {
                    return this.execute("sys/rest/updateUser", b || {});
                },
                GetUtilizadorById: function (b) {
                    return this.execute("sys/rest/GetUtilizadorById", b || {});
                }
            }
        );
    };


    /** adicionar variavel write_student no scope student */
    docente.docente = function (painel = null, callback = () => { }) {
        page.focusELementMenu(4);
        /** pintar formulario */
        document.querySelector(".ptc")
            .innerHTML = [
                '<h3>Administração</h3>'
            ].join("");

       

            var response = [{
                "nome": "INFORMATICA",
                "descricao": "string",
                "duracao": "string",
                "codigo": "string",
                "nivel": 1,
                "dapartamentoId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
              },
              {
                "nome": "GESTÂO IMPRESARIAL",
                "descricao": "string",
                "duracao": "string",
                "codigo": "string",
                "nivel": 1,
                "dapartamentoId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
              }];

            document.querySelector(".result-search")
                .innerHTML = "";

            response.find(function (ar) {
                var div = document.createElement("div");
                div.classList.add("list");
                div.data = ar;
                div.innerHTML = [
                    '<div>', ar.nome, '</div>'
                ].join("");

                page.contextmenu(div, {
                    options: [
                        {
                            label: "Configuração",
                            select: function () {
                                console.log(this);
                            }
                        },
                        {
                            label: "Profile",
                            select: function () {
                                console.log(this);
                            }
                        }
                    ]
                });
                document.querySelector(".result-search")
                    .appendChild(div);
                clickHancor(document.querySelector(".result-search"));
            });


            /** sefor um aplicativo mobile */
            document.querySelector(".filter-left")
                .addEventListener("click", function () {
                    if (document.querySelector(".list-lateral-focus"))
                        return document.querySelector(".list-lateral")
                            .classList.remove("list-lateral-focus");

                    document.querySelector(".list-lateral")
                        .classList.add("list-lateral-focus");
                });

            /** validar formulario */
            var reload = () => {
                page.focusElemenNavegar("#nome");
                clearTimeout(window.setProgress);
                document.body.classList.add("stop-load");
                page.globalScroll(".result-search-scroll");
                 // add click hancor
                clickHancor(document.querySelector(".form"));
            }, validate = {
                nome: function () {
                    if (this.value == "")
                        return false;
                    return true;
                }
            };


            page.form("#docente").create({
                rules: validate,
                done: function (response) { 
                },
                controller: docente.method,
                button: [{ label: "Salvar", submit: true, class: "btnns extlink" }],
                filds: [
                    { name: "nome", id: "nome", type: "text", autocomplete:"off", label: "Nome Completo", "mensage-worning": "" },
                    { name: "telefone", id: "telefone", type: "text", autocomplete:"off", label: "telefone", "mensage-worning": "" },
                    { name: "email", id: "email", type: "text", autocomplete:"off", label: "email", "mensage-worning": "" },
                    { name: "grauAcademico", id: "grauAcademico", type: "text", autocomplete:"off", label: "grauAcademico", "mensage-worning": "" },
                    { name: "endereco", id: "endereco", type: "text", autocomplete:"off", label: "endereco", "mensage-worning": "" },
                    { name: "senha", id: "senha", type: "text", autocomplete:"off", label: "senha", "mensage-worning": "" }
                ]
            }).then(resonse => {
                return reload();
            });


    };

})();