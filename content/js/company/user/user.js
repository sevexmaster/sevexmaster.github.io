(function () {

    /** criar scop para variaves do painel student */
    (page.painel || {}).user = {};

    var user = page.painel.user;

    user.method = () => {
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
    user.user = function (painel = null, callback = () => { }) {
        page.focusELementMenu(4);
        /** pintar formulario */
        document.querySelector(".ptc")
            .innerHTML = [
                '<h3>Administração</h3>'
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
                page.maskPhoneAng( "#telefone" );
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


            page.form("#Utilizadores").create({
                rules: validate,
                done: function (response) { 
                    var response = response[0] || {};
                    return openPage({ state: { url: page.dir+'company/index' } }, function () {
                         page.popup({
                            title: 'Cadastro',
                            html: '<p>Utilizador criado com sucesso.</p>',
                            button: '<button class="bak-green" id="print">ok</button>',
                            footer: function () { }
                        });
                    });
                },
                controller: user.method,
                button: [{ label: "Salvar", submit: true, class: "btnns extlink" }],
                filds: [
                    { name: "fotografia", id: "fotografia", type: "text", label: "FOTO", editor: function () {
                       page.editorIMG(this.element, function() {
                            document.querySelector( "#fotografia" ).value = this.base64;
                       });
                    } },
                    { name: "nome", id: "nome", type: "text", autocomplete:"off", label: "Nome Completo", "mensage-worning": "" },
                    { name: "loginName", id: "loginName", type: "text", autocomplete:"off", label: "Login Name", "mensage-worning": "" },
                    { name: "telefone", id: "telefone", type: "text", autocomplete:"off", label: "Telefone", "mensage-worning": "" },
                    { name: "email", id: "email", type: "text", autocomplete:"off", label: "E-mail", "mensage-worning": "" },
                    { name: "perfilId", id: "perfilId", type: "text", autocomplete:"off", label: "Perfil", editor: function () {
                       /* this.dropDown(this.element.querySelector("input"), {
                            post: {
                                url: "sys/rest/GetPerfis",
                                data: {}
                            },
                            dataValueField: "id",
                            dataTextField: "nome"
                        });*/
                    }, "mensage-worning": "" }
                ]
            }).then(resonse => {
                return reload();
            });


    };

})();