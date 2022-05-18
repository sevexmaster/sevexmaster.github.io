(function () {

    /** criar scop para variaves do painel student */
    (page.painel || {}).turmas = {};

    var turmas = page.painel.turmas;

    turmas.method = () => {
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
    turmas.turmas = function (painel = null, callback = () => { }) {
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


            page.form("#turmas").create({
                rules: validate,
                done: function (response) { 
                },
                controller: turmas.method,
                button: [{ label: "Salvar", submit: true, class: "btnns extlink" }],
                filds: [
                    { name: "anoLectivoId", id: "anoLectivoId", type: "text", autocomplete:"off", label: "Ano", "mensage-worning": "" },
                    { name: "cursoId", id: "cursoId", type: "text", autocomplete:"off", label: "Curso", "mensage-worning": "" },
                    { name: "sala", id: "sala", type: "text", autocomplete:"off", label: "Sala", "mensage-worning": "" },
                    { name: "turno", id: "turno", type: "text", autocomplete:"off", label: "Turno", "mensage-worning": "" },
                    { name: "codigo", id: "codigo", type: "text", autocomplete:"off", label: "Codigo", "mensage-worning": "" }
                ]
            }).then(resonse => {
                return reload();
            });


    };

})();