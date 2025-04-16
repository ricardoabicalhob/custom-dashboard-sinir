import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { DataFilteredProps } from "../page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

interface GraficoProps {
    title :string
    subTitle? :string
    dataFiltered? :DataFilteredProps[]
}

interface TotalQuantidadesPorResiduo {
    residuoDescricao: string;
    quantidadeEstimada: number;
} 

export default function GraficoAT({ dataFiltered, title, subTitle } :GraficoProps) {

    function totalizarQuantidadesPorResiduo(data: DataFilteredProps[]): TotalQuantidadesPorResiduo[] {
      if (!data) {
        return []
      }
    
      const quantidadesAgrupadas: {
        [residuoDescricao: string]: {
          quantidadeEstimada: number;
        };
      } = data.reduce((acumulador, item) => {
        const { residuoDescricao, quantidadeEstimada } = item;
    
        if (acumulador[residuoDescricao]) {
          acumulador[residuoDescricao].quantidadeEstimada += quantidadeEstimada;
        } else {
          acumulador[residuoDescricao] = { quantidadeEstimada };
        }
    
        return acumulador
      }, {} as { [key: string]: { quantidadeEstimada: number } });
    
      const resultado = Object.entries(quantidadesAgrupadas).map(
        ([residuoDescricao, quantidades]) => ({
          residuoDescricao,
          quantidadeEstimada: quantidades.quantidadeEstimada,
        })
      )

      const totalGeralEstimado = resultado.reduce((soma, item)=> soma + item.quantidadeEstimada, 0)

      resultado.push({
        residuoDescricao: 'TOTAL RESÍDUOS',
        quantidadeEstimada: totalGeralEstimado,
      })

      return resultado
    }

    const chartConfig = {
      desktop: {
        label: "Desktop",
        color: "#00695C",
      }
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
            <CardTitle>{`Total acumulado: ${totalizarQuantidadesPorResiduo(dataFiltered || []).reverse()[0].quantidadeEstimada.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TON`}</CardTitle>
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
              </BarChart>

          </ChartContainer>
        </CardContent>
      </Card>
    )
  }