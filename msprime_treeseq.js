async function local_fn() {
          let pyodide = await loadPyodide({indexURL: "https://cdn.jsdelivr.net/pyodide/dev/full/"});
        await pyodide.loadPackage("msprime");
          // Pyodide is now ready to use...
          //let msprime = await pyodide.pyimport("msprime");
          //ts = msprime.sim_ancestry(5);
          svg = pyodide.runPython(`
              import msprime
              ts = msprime.sim_ancestry(5)
              ts.draw_svg(size=(500, 500))
              `)
            //var where = d3.select("#treeseq_svg").append(svg)
        let location = document.getElementById("treeseq_svg");
        location.outerHTML += svg;
          };
local_fn();

