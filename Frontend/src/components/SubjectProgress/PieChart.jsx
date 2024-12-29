import { useEffect } from "react";
import { Chart } from "chart.js";

export default function PieChart({chartId,title,labels,values})
{

    const data = {
        labels: labels,
        datasets: [{
          label: title,
          data: values,
          hoverOffset: 4
        }]
      };

    useEffect(()=>{
        new Chart
        (
            document.getElementById(chartId),
            {
                type: 'pie',
                data: data,
                options:{
                    plugins:{
                        legend:{
                            display:(window.screen.width>480)?true:false,
                            align:'start'
                        }
                    }
                }
            }
        );
    },[])

    return(

        <div style={{height:'80%',width:'100%',display:'flex',alignItems:'center',justifyContent:'center',margin:'auto'}}>

            <canvas id={chartId}></canvas>

        </div>

    )
}