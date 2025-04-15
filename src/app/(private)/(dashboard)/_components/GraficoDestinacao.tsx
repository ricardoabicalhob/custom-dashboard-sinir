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

export default function GraficoDestinacao({ dataFiltered, title, subTitle } :GraficoProps) {

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
      <Card className="w-full md:w-[100%] max-w-7xl justify-self-center">
        <CardHeader>
          <div className="flex flex-col gap-2 items-center justify-center">
            <CardTitle className="text-lg sm:text-xl text-gray-800">
                {title}
            </CardTitle>
            {
              subTitle &&
                <CardTitle className="font-light">{subTitle}</CardTitle>
            }
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="max-h-[300px] w-full">
              
              <BarChart data={totalizarQuantidadesPorResiduo(dataFiltered || [])}>
                  <CartesianGrid vertical={false}/>
                  <XAxis
                      className="select-none"
                      dataKey="residuoDescricao"
                      tickLine={false}
                      tickMargin={10}
                      fontSize={12}
                      axisLine={false}
                      tickFormatter={(value)=>value}
                  />

                  <YAxis 
                      stroke="#888888"
                      fontSize={12}
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
                  />

                  <Bar
                      dataKey="quantidadeReal"
                      fill="var(--color-mobile)"
                      radius={[4, 4, 0, 0]}
                  />
              </BarChart>

          </ChartContainer>
        </CardContent>
      </Card>
    )
  }