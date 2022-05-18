(function () {

    /** criar scop para variaves do painel student */
    (page.painel || {}).student = {};

    var student = page.painel.student,
    filterTipoDocumento = (id)=>{
        if( id == 1 ) 
            return document.querySelector( "#numdoc" ).validateBi = true;

        document.querySelector( "#numdoc" ).validateBi = false;
    };
    

    student.inscricao = () => {
        return page.proto(
            {
                set: function(b){
                    return this.execute("sys/rest/setInscricao", b || {});
                },
                getAll: function (b) {
                    return this.execute("sys/rest/getTodosInscritos", b || {});
                },
                getFichaAluno: function (b) {
                    return this.execute("sys/rest/getFichaAluno", b || {});
                },
                getAlunoInscricao: function (b) {
                    return this.execute("sys/rest/getAlunoInscricao", b || {});
                }
            }
        );
    };
           

    /** adicionar variavel write_student no scope student */
    student.write_student = function (painel = null, callback = () => { }) {
        /** pintar formulario */
        document.querySelector(".ptc")
            .innerHTML = [
                '<h3>Secretaria</h3>',
                '<p>Inscrição de alunos</p>'
            ].join("");

        page.focusELementMenu(1);


        /** sefor um aplicativo mobile */
        document.querySelector(".filter-left")
            .addEventListener("click", function () {
                if (document.querySelector(".list-lateral-focus"))
                    return document.querySelector(".list-lateral")
                        .classList.remove("list-lateral-focus");

                document.querySelector(".list-lateral")
                    .classList.add("list-lateral-focus");
            });

        function writeForm(response, calback) {

            var doc = document;
            doc.querySelector("#nome").value = response.nome;
            doc.querySelector("#dnascimento").value = response.data_nascimento;
            doc.querySelector("#numdoc").value = response.n_documento;
            doc.querySelector("#morada").value = response.morada;
            doc.querySelector("#telefone1").value = response.telefone1;
            doc.querySelector("#telefone2").value = response.telefone2;
            doc.querySelector("#email").value = response.email;
            
            
            page.data("#muni").value(response.municipio);
            page.data("#distrito").value(response.distrito);
            page.data("#curso").value(response.curso);
            page.data("#classe").value(response.classe);
            page.data("#turno").value(response.turno_id);
            page.data("#tipo").value(response.tipo_documento_id);
            page.data("#genero").value(response.genero_id);
            page.data("#eciv").value(response.estado_civil_id);
            
            

            calback();
            page.form("#createAluno").update({
                primarykey: page.u(1)._,
                controller: student.inscricao
            });
        }
        /** validar formulario */
        var reload = () => {
            clearTimeout(window.setProgress);
            document.body.classList.add("stop-load");
            if (painel == "Dasbord")
                return callback();

            page.focusElemenNavegar("#nome");
            page.maskPhoneAng( "#telefone1" );
            page.maskPhoneAng( "#telefone2" );
            page.maskbi( "#numdoc" );

            return page.navegar(document.querySelector("form"));
        }, validate = {
            nome: function () {
                if (this.value == "")
                    return false;
                return true;
            },
            dnascimento: function () {
                if (this.value == "")
                    return false;
                return true;
            },
            tipo: function () {
                if (this.value == "")
                    return false;
                return true;
            },
            numdoc: function () {
                if (this.value == "")
                    return false;
                return true;
            },
            genero: function () {
                if (this.value == "")
                    return false;
                return true;
            },
            eciv: function () {
                if (this.value == "")
                    return false;
                return true;
            },
            muni: function () {
                if (this.value == "")
                    return false;
                return true;
            },
            distrito: function () {
                if (this.value == "")
                    return false;
                return true;
            },
            morada: function () {
                if (this.value == "")
                    return false;
                return true;
            },
            telefone1: function () {
                if (this.value == "" || this.value == "(+244) ")
                    return false;
                return true;
            },
            telefone2: function () {
                if (this.value == "" || this.value == "(+244) ")
                    return false;
                return true;
            },
            email: function () {
                if (this.value == "")
                    return false;
                return true;
            },
            classe: function () {
                if (this.value == "")
                    return false;
                return true;
            },
            curso: function () {
                if (this.value == "")
                    return false;
                return true;
            },
            turno: function () {
                if (this.value == "")
                    return false;
                return true;
            }
        };

        student.inscricao().getAll({ ano: 1 }).then(resonse => {

            var initial = resonse,
                query = ((document.searsh || {}).inscricao || {}),
                result = (resonse) => {
                    document.querySelector(".result-search")
                        .innerHTML = "";

                    resonse.find(function (ar) {
                        var div = document.createElement("div");
                        div.setAttribute("href", page.dir + 'secretary/student/write-student&_=' + ar.id);
                        div.classList.add("list");
                        div.data = ar;
                        div.innerHTML = [
                            '<div>', ar.nome, '</div>'
                        ].join("");
                        page.contextmenu(div, {
                            options: [
                                {
                                    label: "Editar",
                                    select: function () {
                                        var href = this.element.getAttribute("href");
                                        page.setURL(href);
                                    }
                                },
                                {
                                    label: "imprimir",
                                    select: function () {
                                        clearTimeout(window.setProgress);
                                        document.body.classList.remove("stop-load");
                                        student.inscricao().getFichaAluno({ aluno: this.element.data.id }).then(response => {
                                            return student.write_student_pdf(response[0]);
                                        });
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
                };

            page.autocomplite("#filterAnuno input", {
                post: {
                    url: "sys/rest/getFilterAlunos",
                    data: {},
                    filterGoogle: true,
                    template: function (response) {
                        var nrespo = new Array();
                        ((response || initial) || []).find(x => { nrespo.push(x.dataItem || x) });
                        if (!document.searsh)
                            document.searsh = {};
                        document.searsh.inscricao = { data: nrespo, value: this.element.value };
                        result(nrespo);
                    }
                },
                dataValueField: "id",
                dataTextField: "nome"
            });

            if (query.data)
                document.querySelector("#filterAnuno .page-input > input").value = query.value;

            result(query.data || resonse);
            if (painel == "Dasbord")
                return reload();
            // carregar formulario
            page.form("#createAluno").create({
                rules: validate,
                done: function (response) {
                    var response = response[0] || {};
                    return openPage({ state: { url: 'secretary/student/write-student' } }, function () {
                         page.popup({
                            title: 'Inscrição',
                            html: '<p>Aluno Inscrito com sucesso.</p>',
                            button: '<button class="bak-green" id="print">Imprimir</button>',
                            footer: function () {
                                var poup = this.popup,
                                print = poup.querySelector("#print");
                                print.addEventListener("click", function(){
                                    student.inscricao().getAlunoInscricao({aluno:response.id}).then( response =>{ 
                                        return student.write_student_pdf(response[0]);
                                    });
                                });
                            }
                        });
                    });
                   
                },
                controller: student.inscricao,
                button: [{ label: "Salvar", submit: true, id: "savem" }],
                filds: [
                    { name: "foto_user", id: "foto_user", type: "file", label: "FOTO", editor: function () {
                       page.editorIMG(this.element);
                    } },
                    { name: "nome", id: "nome", type: "text", autocomplete:"off", label: "Nome Completo", "mensage-worning": "" },
                    { name: "dnascimento", id: "dnascimento", type: "date", label: "Data de nascimento", "mensage-worning": "" },
                     {
                        name: "tipo", id: "tipo", type: "text", label: "Tipo de documento", editor: function () {
                            this.dropDown(this.element.querySelector("input"), {
                                post: {
                                    url: "sys/rest/getTipoDocumento",
                                    data: {}
                                },
                                dataValueField: "id",
                                dataTextField: "descricao",
                                select: function(e){
                                    filterTipoDocumento( this.dataItem.id );
                                }
                            });
                        }, "mensage-worning": ""
                    },
                    { name: "numdoc", id: "numdoc", type: "text", autocomplete:"off", label: "Nº documento", "mensage-worning": "" },
                    {
                        name: "genero", type: "text", label: "Genero", id: "genero", editor: function () {
                            this.dropDown(this.element.querySelector("input"), {
                                post: {
                                    url: "sys/rest/getGenero",
                                    data: {}
                                },
                                dataValueField: "id",
                                dataTextField: "descricao"
                            });
                        }, "mensage-worning": ""
                    },
                    {
                        name: "eciv", id: "eciv", type: "text", label: "Estado civil", "mensage-worning": "", editor: function () {
                            this.dropDown(this.element.querySelector("input"), {
                                post: {
                                    url: "sys/rest/getEstadoCivil",
                                    data: {}
                                },
                                dataValueField: "id",
                                dataTextField: "descricao"
                            });
                        }
                    },
                    {
                        name: "nee", id: "nee", type: "text", label: "NEE", "mensage-worning": "", editor: function () {
                            this.dropDown(this.element.querySelector("input"), {
                                post: {
                                    url: "sys/rest/getEstadoCivil",
                                    data: {}
                                },
                                dataValueField: "id",
                                dataTextField: "descricao"
                            });
                        }
                    },
                    {
                        name: "muni", id: "muni", type: "text", label: "Municipio", "mensage-worning": "", editor: function () {
                            this.autocomplite(this.element.querySelector("input"), {
                                post: {
                                    url: "sys/rest/getFilterMunicipio",
                                    data: {},
                                    filterGoogle: true
                                },
                                dataValueField: "id",
                                dataTextField: "nome"
                            });
                        }
                    },
                    {
                        name: "distrito", id: "distrito", type: "text", label: "Destrito", "mensage-worning": "", editor: function () {
                            this.autocomplite(this.element.querySelector("input"), {
                                post: {
                                    url: "sys/rest/getFilterDestrito",
                                    data: {},
                                    filterGoogle: true
                                },
                                dataValueField: "id",
                                dataTextField: "nome"
                            });
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
                            this.autocomplite(this.element.querySelector("input"), {
                                post: {
                                    url: "sys/rest/getFilterClasse",
                                    data: {},
                                    filterGoogle: true
                                },
                                dataValueField: "id",
                                dataTextField: "descricao"
                            });
                        }, "mensage-worning": ""
                    },
                    {
                        name: "curso", type: "text", label: "curso", id: "curso", "mensage-worning": "", editor: function () {
                            this.autocomplite(this.element.querySelector("input"), {
                                post: {
                                    url: "sys/rest/getFilterCurso",
                                    data: {},
                                    filterGoogle: true
                                },
                                dataValueField: "id",
                                dataTextField: "descricao"
                            });
                        }
                    },
                    {
                        name: "turno", type: "text", label: "turno", id: "turno", "mensage-worning": "", editor: function () {
                            this.dropDown(this.element.querySelector("input"), {
                                post: {
                                    url: "sys/rest/getTurno",
                                    data: {}
                                },
                                dataValueField: "id",
                                dataTextField: "descricao"
                            });
                        }
                    }
                ]
            }).then(resonse => {
                var alunoID = page.u(1)._;
                if (alunoID)
                    return (() => {
                        student.inscricao().getAlunoInscricao({aluno:alunoID}).then( response =>{ 
                            return writeForm(response[0] || {}, () => {
                                return reload();
                            });
                        } );
                    })();
                return reload();
            });
        });
    };

})();