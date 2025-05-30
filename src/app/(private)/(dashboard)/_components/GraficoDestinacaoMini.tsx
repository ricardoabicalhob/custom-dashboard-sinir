import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataFilteredProps } from "../page";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

interface GraficoProps {
    title :string
    subTitle? :string
    dataFiltered? :DataFilteredProps[]
}

interface TotalQuantidadesPorResiduo {
    residuoDescricao: string;
    quantidadeEstimada: number;
    quantidadeReal: number;
}

export default function GraficoDestinacaoMini({ dataFiltered, title, subTitle } :GraficoProps) {

    function totalizarQuantidadesPorResiduo(data: DataFilteredProps[]): TotalQuantidadesPorResiduo[] {
      if (!data) {
        return []
      }
    
      const quantidadesAgrupadas: {
        [residuoDescricao: string]: {
          quantidadeEstimada: number;
          quantidadeReal: number;
        };
      } = data.reduce((acumulador, item) => {
        const { residuoDescricao, quantidadeEstimada, quantidadeReal } = item;
    
        if (acumulador[residuoDescricao]) {
          acumulador[residuoDescricao].quantidadeEstimada += quantidadeEstimada;
          acumulador[residuoDescricao].quantidadeReal += quantidadeReal;
        } else {
          acumulador[residuoDescricao] = { quantidadeEstimada, quantidadeReal };
        }
    
        return acumulador
      }, {} as { [key: string]: { quantidadeEstimada: number; quantidadeReal: number } });
    
      const resultado = Object.entries(quantidadesAgrupadas).map(
        ([residuoDescricao, quantidades]) => ({
          residuoDescricao,
          quantidadeEstimada: quantidades.quantidadeEstimada,
          quantidadeReal: quantidades.quantidadeReal,
        })
      ).filter(item => item.quantidadeReal !== 0)

      const totalGeralEstimado = resultado.reduce((soma, item)=> soma + item.quantidadeEstimada, 0)
      const totalGeralReal = resultado.reduce((soma, item)=> soma + item.quantidadeReal, 0)

      resultado.push({
        residuoDescricao: 'TOTAL RESÍDUOS',
        quantidadeEstimada: totalGeralEstimado,
        quantidadeReal: totalGeralReal
      })

      return resultado
    }

    const chartConfig = {
      desktop: {
        label: "Desktop",
        color: "#00695C",
      },
      mobile: {
        label: "Mobile",
        color: "#00695C80",
      },
    } satisfies ChartConfig

    return(
      <Card className="flex flex-col w-full max-w-full h-fit justify-self-center">
        <CardHeader>
          <div className="flex flex-col items-center justify-center">
            <CardTitle className="text-sm sm:text-base text-gray-800">
                {title}
            </CardTitle>
            {
              subTitle &&
                <CardTitle className="text-sm font-light">{subTitle}</CardTitle>
            }
            <CardTitle className="text-sm">{`Total: ${totalizarQuantidadesPorResiduo(dataFiltered || []).reverse()[0].quantidadeReal.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TON`}</CardTitle>

          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className={`max-h-[120px] w-full`}>
              
              <BarChart data={totalizarQuantidadesPorResiduo(dataFiltered || [])}>
                  <CartesianGrid vertical={false}/>
                  <XAxis
                      className="select-none"
                      dataKey="residuoDescricao"
                      tickLine={false}
                      tickMargin={10}
                      fontSize={10}
                      axisLine={false}
                      tickFormatter={(value)=>value}
                  />

                  <YAxis 
                      stroke="#888888"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value)=>`${value} TON`}
                  />

                  <ChartTooltip content={<ChartTooltipContent/>}/>
                  <ChartLegend content={<ChartLegendContent/>}/>
                  <CartesianGrid vertical={false}/>

                  <Bar
                      dataKey="quantidadeEstimada"
                      fill="var(--color-desktop)"
                      radius={[4, 4, 0, 0]}
                      barSize={40}
                  />

                  <Bar
                      dataKey="quantidadeReal"
                      fill="var(--color-mobile)"
                      radius={[4, 4, 0, 0]}
                      barSize={40}
                  />
              </BarChart>

          </ChartContainer>
        </CardContent>
      </Card>
    )
  }