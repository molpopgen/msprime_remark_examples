function msprime_treeseq(pyodide) {
    svg = pyodide.runPython(`
              import msprime
              ts = msprime.sim_ancestry(5)
              ts.draw_svg(size=(500, 500))
              `)
    let location = document.getElementById("treeseq_svg");
    location.outerHTML += svg;
};

