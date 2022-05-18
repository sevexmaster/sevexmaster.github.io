(function () {

    /** criar scop para variaves do painel student */
    (page.painel || {}).inscricao = {};

    var inscricao = page.painel.inscricao;

    inscricao.method = () => {
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
    inscricao.inscricao = function (painel = null, callback = () => { }) {
        page.focusELementMenu(1);
        /** pintar formulario */
        document.querySelector(".ptc")
            .innerHTML = [
                '<h3>Secretaria</h3>'
            ].join("");

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
                page.maskPhoneAng( "#telefone1" );
                page.maskPhoneAng( "#telefone2" );
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


            page.form("#inscricao").create({
                rules: validate,
                done: function (response) { 
                },
                controller: inscricao.method,
                button: [{ label: "Salvar", submit: true, class: "btnns extlink" }],
                filds: [
                    { name: "foto_user", id: "foto_user", type: "file", label: "FOTO", editor: function () {
                        page.editorIMG(this.element);
                     } },
                     { name: "nome", id: "nome", type: "text", autocomplete:"off", label: "Nome Completo", "mensage-worning": "" },
                     { name: "dnascimento", id: "dnascimento", type: "date", label: "Data de nascimento", "mensage-worning": "" },
                      {
                         name: "tipo", id: "tipo", type: "text", label: "Tipo de documento", editor: function () {
                         }, "mensage-worning": ""
                     },
                     { name: "numdoc", id: "numdoc", type: "text", autocomplete:"off", label: "Nº documento", "mensage-worning": "" },
                     {
                         name: "genero", type: "text", label: "Genero", id: "genero", editor: function () {
                         }, "mensage-worning": ""
                     },
                     {
                         name: "eciv", id: "eciv", type: "text", label: "Estado civil", "mensage-worning": "", editor: function () {
                         }
                     },
                     {
                         name: "nee", id: "nee", type: "text", label: "NEE", "mensage-worning": "", editor: function () {
                         }
                     },
                     {
                         name: "muni", id: "muni", type: "text", label: "Municipio", "mensage-worning": "", editor: function () {
                         }
                     },
                     {
                         name: "distrito", id: "distrito", type: "text", label: "Destrito", "mensage-worning": "", editor: function () {
                         }
                     },
                     { name: "morada", id: "morada", type: "text", label: "Morada", "mensage-worning": "", editor: function () {
 
                         var elment = document.createElement( "div" );
                         this.textarea(this.element.querySelector("input"),{});
                         this.element.appendChild(elment); 
                         page.attachment(elment);
 
                     } },
                     { name: "proescolar", id: "proescolar", type: "text", label: "Proveniência Escolar", "mensage-worning": "", editor: function () {
 
                         var elment = document.createElement( "div" );
                         this.textarea(this.element.querySelector("input"),{});
                         this.element.appendChild(elment); 
                     } },
                     { name: "telefone1", id: "telefone1", type: "text", autocomplete:"off", label: "Telefone 1", "mensage-worning": "" },
                     { name: "telefone2", id: "telefone2", type: "text", autocomplete:"off", label: "Telefone 2(Opcional)", "mensage-worning": "" },
                     { name: "email", id: "email", type: "text", autocomplete:"off", placeholder:"exemplo@gmail.com", label: "Correio Eletronico" },
                     {
                         name: "anoid", id: "anoid", type: "hidden", value:1 },
                     {
                         name: "classe", id: "classe", type: "text", label: "classe", editor: function () {
                         }, "mensage-worning": ""
                     },
                     {
                         name: "curso", type: "text", label: "curso", id: "curso", "mensage-worning": "", editor: function () {
                         }
                     },
                     {
                         name: "turno", type: "text", label: "turno", id: "turno", "mensage-worning": "", editor: function () {
                         }
                     }
                ]
            }).then(resonse => {
                return reload();
            });


    };

})();