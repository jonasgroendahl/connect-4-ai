import pandas as pd

df = pd.read_csv('results/data.csv', sep=' ')

pv = df.pivot(index='Player1',
             columns='Player2',
             values='Result')

s = pv.style.to_latex(hrules=True)

print(pv.to_latex(index=True,
                  formatters={"name": str.upper},
                  float_format="{:.1f}".format,position="H",
).replace('NaN',''))
