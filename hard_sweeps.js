function hard_sweep(pyodide, rho, location) {
    pyodide.runPython(`
import msprime
import numpy as np

L = 1e6
N = 1e4
ALPHA = 1e3
RHO = ${rho}

sweep = msprime.SweepGenicSelection(
    position=L / 2.0,
    start_frequency=1.0 / 2.0 / N,
    end_frequency=1.0 - 1.0 / 2.0 / N,
    s=ALPHA / 2.0 / N,
    dt=1e-6,
)

hudson = msprime.StandardCoalescent()

nsamples = 50

ts = msprime.sim_ancestry(
    nsamples, model=[sweep, hudson], recombination_rate=RHO / 4.0 / N / L, sequence_length=L,
    population_size=N
)

# ts = msprime.sim_mutations(ts, discrete_genome=False, rate = RHO/4./N/L)

wins = np.linspace(0.0, L, 250)
mids = (wins[1:] + wins[:-1]) / 2

denom = np.sum([1/i for i in range(1, 2*nsamples)]) 

div = ts.diversity(windows=wins, mode="branch") / N
segsites = ts.segregating_sites(windows=wins, mode="branch") / denom / N
ymax = max(div.max(), segsites.max()) * 1.05
`);
    // turn float64array into normal array
    var position = [].slice.call(pyodide.globals.get('mids').toJs());
    var div = [].slice.call(pyodide.globals.get('div').toJs());
    var segs = [].slice.call(pyodide.globals.get('segsites').toJs());
    var ymax = pyodide.globals.get('ymax')
    dataobj = position.map(function(x, i) {
        return { "position": x, "statistic": div[i], "label": "π" }
    }.bind(this));

    segs.map(function(seg, i) { dataobj.push({ "position": position[i], "statistic": seg, "label": "θ" }); });

    var options = {
        height: 300,
        width: 500,
        y: { domain: [0, ymax] },
        marks: [Plot.dot(dataobj, { x: "position", y: "statistic", stroke: "label", title: d => `position: ${d.position}\nstat: ${d.label}\nvalue: ${d.statistic}`, fill: "label", fillOpacity: 0.5 })]
    };
    document.getElementById(location).appendChild(Plot.plot(options))
}
