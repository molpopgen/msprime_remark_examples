async function make_heterozygosity_plot(pyodide) {
    pyodide.runPython(`
              import msprime
              import numpy
              ts = msprime.sim_ancestry(100, sequence_length=1e6, recombination_rate=1e-6, random_seed = 651243)
              wins = numpy.linspace(0.0, 1e6, 400)
              mids = (wins[1:] + wins[:-1]) / 2
              div = ts.diversity(windows=wins, mode="branch")
              `)

    // turn float64array into normal array
    var position = [].slice.call(pyodide.globals.get('mids').toJs());
    var div = [].slice.call(pyodide.globals.get('div').toJs());
    dataobj = position.map(function(x, i) {
        return { "position": x, "div": div[i] }
    }.bind(this));

    var options = {
        height: 500,
        width: 500,
        marks: [Plot.line(dataobj, { x: "position", y: "div" })]
    };
    document.getElementById("heterozygosity").appendChild(Plot.plot(options))
};
