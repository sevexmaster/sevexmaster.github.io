
/**
 * imprimir ficha do Alnuno
 */
 (function () {

    /** verificação de scope */
    if( !( page.painel || {} ).student ) return false;

    page.painel.student.write_student_pdf = function (response) {
        var response = response || {};
        page.srcToBase64(page.dir + 'content/img/ESSCA-logo.png', 100, 100, function (iconapp) {
            page.srcToBase64(page.dir + 'content/img/ESSCA-logo.png', 250, 250, function (datauri) {
                var doc = new jsPDF(),
                    TnCell = 0, data = [];

                data.push(
                    [
                        { content: "", styles: { minCellHeight: 45 } }
                    ],
                    [
                        { content: "Turno: " + response.turno, styles: { minCellHeight: 7 } }
                    ],
                    [
                        { content: "Sala: " + response.sala, styles: { minCellHeight: 7 } }
                    ],
                    [
                        { content: "Dados Pessoa", styles: { minCellHeight: 10, fontStyle: 'bold', fontSize: 12 } }
                    ],
                    [
                        { content: "Tipo de documento: " + response.documento, styles: { minCellHeight: 7 } }
                    ],
                    [
                        { content: "Nº do documento: " + response.n_documento, styles: { minCellHeight: 7 } }
                    ],
                    [
                        { content: "Nif: " + response.nif, styles: { minCellHeight: 7 } }
                    ],
                    [
                        { content: "Genero: " + response.genero, styles: { minCellHeight: 7 } }
                    ],
                    [
                        { content: "Estado civil: " + response.estado_civil, styles: { minCellHeight: 7 } }
                    ],
                    [
                        { content: "Municipio: " + response.municipio, styles: { minCellHeight: 7 } }
                    ],
                    [
                        { content: "Destrito: " + response.destrito, styles: { minCellHeight: 7 } }
                    ],
                    [
                        { content: "Data de nascimento: " + response.documento, styles: { minCellHeight: 7 } }
                    ]
                );


                doc.autoTable({
                    theme: 'plain',
                    margin: { top: 40 },
                    tableWidth: 'auto',
                    body: data,
                    didDrawCell: function (data) {

                        if (data.column.index == 0 && data.row.index == 0) {
                            doc.setDrawColor(0);
                            doc.setFillColor(251, 251, 253);
                            doc.rect(0, data.cell.y - 5, data.cell.width + (data.cell.x * 2), data.cell.height, 'F');


                            doc.setLineWidth(1.0);
                            doc.setDrawColor(226, 226, 240);
                            doc.setFillColor(251, 251, 253);
                            doc.roundedRect(data.cell.width - 20, data.cell.y, 30, 35, 3, 3, 'FD');

                            doc.setFontType('bold');
                            doc.text("FOTO", data.cell.width - 10, data.cell.y + 19);

                            doc.setFontType('bold');
                            doc.text("Nome Completo: " + response.nome, data.cell.x, data.cell.y + 5);
                            doc.text("N/0: " + response.id, data.cell.x, data.cell.y + 10);

                            doc.setFontType('normal');
                            doc.text("Ano Lectivo: " + response.anoLectivo, data.cell.x, data.cell.y + 15);
                            doc.text("Departamento: " + response.departamento, data.cell.x, data.cell.y + 20);
                            doc.text("Curso: " + response.curso, data.cell.x, data.cell.y + 25);
                            doc.text("Classe: " + response.classe, data.cell.x, data.cell.y + 30);
                            doc.text("Turma: " + response.turma + " - Sigla: " + response.sigla, data.cell.x, data.cell.y + 35);
                        }

                    },
                    didDrawPage: function (data) {

                        doc.autoTable({
                            theme: 'plain',
                            margin: { right: 0, left: 0, top: 0 },
                            tableWidth: 'auto',
                            body: [
                                [
                                    { content: "" },
                                    { content: "", styles: { minCellWidth: 15, minCellHeight: 40 } },
                                    { content: "" }
                                ]
                            ],
                            didDrawCell: function (data) {
                                if (data.column.index == 0) {
                                    doc.addImage(datauri, 'PNG', data.cell.x + 13, data.cell.y + 8, 25, 25);
                                }
                                if (data.column.index == 1) {
                                    var t1 = 'FACULDADE TEOLÓGICA BATISTA EQUATORIAL';
                                    doc.setFontType('bold');
                                    doc.setFontSize(14);
                                    doc.text(t1, (doc.internal.pageSize.width / 2) - (doc.getTextDimensions(t1).w / 2), 15);

                                    var t2 = 'Republica de Angola, Ministerio da Educação';
                                    doc.setFontSize(11);
                                    doc.text(t2, (doc.internal.pageSize.width / 2) - (doc.getTextDimensions(t2).w / 2), 20);

                                    var t3 = 'Morada: Avenida primeiro congresso do MPLA, tel:923555083';
                                    doc.setFontSize(9);
                                    doc.text(t3, (doc.internal.pageSize.width / 2) - (doc.getTextDimensions(t3).w / 2), 24);

                                    var t4 = 'FICHA DO ALUNO';
                                    doc.setFontType('bold');
                                    doc.setFontSize(12);
                                    doc.text(t4, (doc.internal.pageSize.width / 2) - (doc.getTextDimensions(t4).w / 2), 30);

                                    doc.setDrawColor(251, 251, 253);
                                    doc.line(0, 35, doc.internal.pageSize.width, 35);

                                }
                            }
                        });


                        // Footer
                        var str = "Page " + doc.internal.getNumberOfPages();

                        var pageSize = doc.internal.pageSize;
                        var pageHeight = pageSize.height
                            ? pageSize.height
                            : pageSize.getHeight();
                        doc.setFontSize(8);
                        doc.text(str, pageSize.width - 20, pageHeight - 10);


                        doc.addImage(iconapp, 'PNG', data.settings.margin.left, pageHeight - 15, 7, 7);

                        doc.setFontSize(8);
                        doc.text('JR ESCOLAR - Programa sertificado pela AGT -0120120', data.settings.margin.left + 12, pageHeight - 10);
                    }
                });

                return page.print(URL.createObjectURL(doc.output('blob')), function (x) {
                    /**
                     * finalizar processo de impreção
                     */
                    clearTimeout(window.setProgress);
                    document.body.classList.add("stop-load");
                });
            });
        });
    };
})();