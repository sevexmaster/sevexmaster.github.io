(function () {
    return (page.painel || {}).inicial = function () {

        document.querySelectorAll('.colect-aluno').forEach(el => {
            var soma = 0;
            el.querySelectorAll('div.image').forEach(x => {
                x.style.marginLeft = soma + "px";
                soma = soma + 27;
            });
        });


        /** pintar formulario */
        document.querySelector(".ptc")
            .innerHTML = [''].join("");


        page.focusELementMenu(0);
        clearTimeout(window.setProgress);
        document.body.classList.add("stop-load");

    };
})();