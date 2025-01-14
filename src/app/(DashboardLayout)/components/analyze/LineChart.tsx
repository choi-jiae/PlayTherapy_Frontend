import React, { useState, useEffect } from 'react';
import { Select, MenuItem, Stack, Box, linearProgressClasses } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import dynamic from "next/dynamic";
import { useParams, useRouter } from 'next/navigation';

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface LineChartProps {
    categories: Array<string>;
    data: Array<any>;
    selectCategory: string;
    setCategory: React.Dispatch<React.SetStateAction<string>>;
    sessionIdList: Array<number>;

}

const LineChart = ({categories, data, selectCategory, setCategory, sessionIdList}: LineChartProps) => {
    const [selectedSeriesItemName, setSelectedSeriesItemName] = useState<string>('');
    const [chartContext, setChartContext] = useState<any>(null);
    const router = useRouter();
    const params = useParams();
    const caseId = Number(params?.case_id);

    useEffect(() => {
        if (chartContext) {
            const { series } = chartContext.w.config;
            if (selectCategory === '') {
                console.log('show all series');
                series.forEach((seriesItem: any) => {
                    chartContext.showSeries(seriesItem.name);
                });
            } else {
                console.log(selectCategory);
                series.forEach((seriesItem: any) => {
                    if (seriesItem.name !== selectCategory) {
                        chartContext.hideSeries(seriesItem.name);
                    } else {
                        chartContext.showSeries(seriesItem.name);
                    }
                });

            }

        }
        }, [selectCategory, chartContext]
    );

    const calculateChartHeight = (categories: string[]) => {
        const baseHeight = 50; // Base height for the chart
        const categoryHeight = 30; // Height per category
        return baseHeight + categories.length * categoryHeight;
    };

    const chartHeight = calculateChartHeight(categories);


    const serieslinechart: any = categories.map((category, index) => ({
        name: category,
        data: Object.values(data[index]).map(((d:any, index: number) => 
            (d.level)
        )),
        }
    ));

    console.log(serieslinechart);

    // chart
    const optionslinechart: any = {
        chart: {
            type: 'line',
            fontFamily: "'Plus Jakarta Sans', sans-serif;",
            foreColor: '#adb0bb',
            events: {
                mounted: (chart: any) => {
                    setChartContext(chart);
                },
                legendClick: function legendClick(ctx: any, seriesIndex: number, config: any) {
                    //setChartContext(ctx);
                    const { series } = config.config;
                    const clickedSeriesItemName = series[seriesIndex].name;
                    console.log('legendClick', clickedSeriesItemName);
                    if (selectCategory === clickedSeriesItemName) {
                        setCategory('');
                        console.log('selectCategory1: ', selectCategory);
                    } else {
                        setCategory(clickedSeriesItemName);
                        console.log('selectCategory: ', selectCategory);
                    }
                },
                xAxisLabelClick: function xAxisLabelClick(ctx: any, seriesIndex: number, config: any) {
                    console.log('xAxisLabelClick', ctx, seriesIndex, config.labelIndex);
                    router.push(`/case/${caseId}/session/${sessionIdList[config.labelIndex]}/analyze`);
                },
                markerClick: function markerClick(ctx: any, seriesIndex: number, indexs: any, config: any) {
                    console.log('markerClick', ctx, seriesIndex, indexs, config);
                    router.push(`/case/${caseId}/session/${sessionIdList[indexs.dataPointIndex]}/analyze`);
                },
            }
            
        },
        colors: [ '#FFD700', '#FFB14E', '#FA8775', '#CD5C5C', '#FFE3F6', '#FDCEFF', '#EAC1FF', '#D4B5FF', '#BBA9FF', '#9F9FFF', '#7C95FF', '#488CFF', '#0085E5', '#007DBD'],
        plotOptions: {
            line: {
                isSlopeChart: true,
                dataLabels: {
                    position: 'top',
                },
            }
        },
        stroke: {
            width: 4,
            curve: 'smooth',
          },
        animation: {

            enabled: false,
        },
        dataLabels: {
            enabled: false,
        },
        legend: {
            onItemHover: {
                highlightDataSeries: false,
            },
        },
        markers: {
            size: 4,
            strokeWidth: 1,
            hover: {
              sizeOffset: 3
            }
          },
        grid: {
            borderColor: 'rgba(0,0,0,0.1)',
            strokeDashArray: 3,
            xaxis: {
                lines: {
                    show: true,
                },
            },
        },
        xaxis: {
            categories: Object.values(data[0]).map((d:any, index: number) => 
                [`${index + 1}회차`, `( ${d.date} )`]),
            labels: {
                rotate: -45,
                style: {
                    colors: '#787878',
                    fontSize: '12px',
                },
            },
            tickAmount: data[0].length,
        },
        yaxis: {
            min: 0,
            max: 4, 
            tickAmount: 4,
        },
        series: serieslinechart,
        tooltip: {
            //enabled: false,
            intersect: true,
            shared: false,
        },
        toolbar: {
            show: true,
            offsetX: 0,
            offsetY: 0,
            tools: {
              download: true,
              selection: true,
              zoom: true,
              zoomin: true,
              zoomout: true,
              pan: true,
              reset: true,
              customIcons: []
            },
        }
    };


    return (

        <DashboardCard
        style={{height: '100%'}}
        >
            <Box sx={{ alignItems: 'center', height: '100%', width: '100%', overflowX: 'scroll', overflowY: 'scroll'}}>
            {/* <div style={{ flex: 1, display: 'flex', height: '100%', width: '100%' }}> */}
                
                <Chart
                    options={optionslinechart}
                    series={serieslinechart}
                    type="line"
                    height= {chartHeight}
                    width= '100%'
                />
            {/* </div> */}
            </Box>
        </DashboardCard>
    );
};

export default LineChart;