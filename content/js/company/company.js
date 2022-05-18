(function () {

    /** criar scop para variaves do painel student */
    (page.painel || {}).company = {};

    var company = page.painel.company;

    company.empresa = () => {
        return page.proto(
            {
                GetEmpresa: function (b) {
                    return this.execute("sys/rest/GetEmpresa", b || {});
                },
                GetEmpresaById: function (b) {
                    return this.execute("sys/rest/GetEmpresaById", b || {});
                },
                GetUtilizadores: function (b) {
                    return this.execute("sys/rest/GetUtilizadores", b || {});
                }
            }
        );
    };


    /** adicionar variavel write_student no scope student */
    company.company = function (painel = null, callback = () => { }) {
        /** pintar formulario */
        document.querySelector(".ptc")
            .innerHTML = [
                '<h3>Administração</h3>',
                ''
            ].join("");

        var dataLink = page.focusELementMenu(4).dataLink;

        document.querySelector(".result-search")
            .innerHTML = "";

        dataLink.find(function (ar) {
            var div = document.createElement("div");
            div.setAttribute("href", ar.u);
            div.classList.add("list");
            div.data = ar;
            div.innerHTML = [
                '<div>', ar.label, '</div>'
            ].join("");
            page.contextmenu(div, {
                options: [
                    {
                        label: "Novo",
                        select: function () {
                            console.log(this);
                        }
                    }
                ]
            });
            document.querySelector(".result-search")
                .appendChild(div);
        });

        // add click hancor
        clickHancor(document.querySelector(".result-search"));
        page.globalScroll(".result-search-scroll");


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
                clearTimeout(window.setProgress);
                document.body.classList.add("stop-load");
                page.globalScroll(".result-search-scroll");
            };

       
           

            var responseUtili = [
                {
                    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa5",
                    "nome": "Adolfo Mulena",
                    "loginName": "string",
                    "telefone": "string",
                    "email": "string",
                    "senha": "string",
                    "fotografia": "",
                    "token": "string",
                    "perfilId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                    "perfil": {
                    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                    "nome": "Administrador",
                    "descricao": "string",
                    "filialId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                        "filial": {
                            "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                            "nome": "string",
                            "nif": "string",
                            "endereco": "string",
                            "logotipo": "",
                            "empresaId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                            "empresa": {
                            "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                            "nome": "string",
                            "endereco": "string",
                            "nif": "string"
                            },
                            "nivelId": 1
                        }
                    }
                },{
                    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa5",
                    "nome": "Gaspar Manuel Magalhães",
                    "loginName": "string",
                    "telefone": "string",
                    "email": "string",
                    "senha": "string",
                    "fotografia": "",
                    "token": "string",
                    "perfilId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                    "perfil": {
                    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                    "nome": "Super user",
                    "descricao": "string",
                    "filialId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                        "filial": {
                            "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                            "nome": "string",
                            "nif": "string",
                            "endereco": "string",
                            "logotipo": "string",
                            "empresaId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                            "empresa": {
                            "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                            "nome": "string",
                            "endereco": "string",
                            "nif": "string"
                            },
                            "nivelId": 1
                        }
                    }
                }
                ], 
            filial = responseUtili[0].perfil.filial;

                page.responseHTML([filial], document.querySelector(".filialdesc"));
                if( filial.logotipo )
                    document.querySelector( ".logo-src" ).style.backgroundImage = "url("+filial.logotipo+")";

                document.querySelectorAll('.colect-aluno').forEach(el => {
                    var soma = 0;
                    el.querySelectorAll('div.image').forEach((x, i) => {
                        x.style.marginLeft = soma + "px";
                        soma = soma + 27;
                        if( ( responseUtili[i] || {fotografia:""} ).fotografia != "" )
                            x.style.backgroundImage = "url("+responseUtili[i].fotografia+")";
                        if( i == 3 )
                            x.innerHTML = "+"+(responseUtili.length - 3);
                    });
                });

                var data = {
                    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                    datasets: [
                        {
                            data: [87, 86, 233, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            backgroundColor: ['green'],
                            hoverBackgroundColor: ['green'],
                            borderColor: ["green"],
                            borderWidth: 1,
                            borderSkipped: false
                        }
                    ]
                };

                var myChart = new Chart(
                    document.getElementById('chart-logs'),
                    {
                        type: 'line',
                        data: data,
                        options: {
                            maintainAspectRatio: false,
                            responsive: true,
                            plugins: {
                                tooltip: {
                                    // Disable the on-canvas tooltip
                                    enabled: false,
                                    external: function (context) {
                                        page.ChartPopUp(context);
                                    }
                                },
                                legend: false // Hide legend
                            },
                            title: {
                                display: false
                            },
                            scales: {
                                y: {
                                    grid: {
                                        display: true,
                                        drawBorder: true
                                    },
                                    ticks: {
                                        // forces step size to be 50 units
                                        stepSize: 300
                                    }
                                },
                                x: {
                                    display: false,
                                    grid: {
                                        display: false,
                                        drawBorder: false,
                                    }
                                }
                            }
                        }
                    }
                );


                // auto resize in charts
                function myChartResize() {
                    myChart.canvas.style.width = 0;
                }
                page.escopeResizeDom(myChartResize);

                return reload();

    };

})();