(function () {

    /** criar scop para variaves do painel student */
    (page.painel || {}).filial = {};

    var filial = page.painel.filial;

    filial.method = () => {
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
    filial.filial = function (painel = null, callback = () => { }) {
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


            page.form("#filial").create({
                rules: validate,
                done: function (response) { 
                },
                controller: filial.method,
                button: [{ label: "Salvar", submit: true, class: "btnns extlink" }],
                filds: [
                    { name: "logo", id: "logo", type: "text", label: "LOGO", editor: function () {
                        page.editorIMG(this.element, function() {
                             document.querySelector( "#logo" ).value = this.base64;
                        });
                     } },
                    { name: "nome", id: "nome", type: "text", autocomplete:"off", label: "Nome", "mensage-worning": "" },
                    { name: "endereco", id: "endereco", type: "text", autocomplete:"off", label: "Endereco", "mensage-worning": "" },
                    { name: "nif", id: "nif", type: "text", autocomplete:"off", label: "Nif", "mensage-worning": "" },
                    { name: "empresa", id: "empresa", type: "text", autocomplete:"off", label: "Empresa", "mensage-worning": "" }
                ]
            }).then(resonse => {
                return reload();
            });


    };

})();