import React, { useEffect } from 'react';
import { Select, MenuItem, Stack, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import dynamic from "next/dynamic";
import { min } from 'lodash';
import { Widgets } from '@mui/icons-material';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface HorizontalBarChartProps {
    categories: Array<string>;
    name: string;
    data: Array<number>;
    label: string;
    colors: Array<string>;
    setCategory: React.Dispatch<React.SetStateAction<string>>;

}

const HorizontalBarChart = ({categories, name, data, label, colors, setCategory}: HorizontalBarChartProps) => {

    const calculateChartHeight = (categories: string[]) => {
        const baseHeight = 50; // Base height for the chart
        const categoryHeight = 30; // Height per category
        return baseHeight + categories.length * categoryHeight;
    };

    const chartHeight = calculateChartHeight(categories);
    

    // chart color
    const theme = useTheme();
    const primary = theme.palette.primary.main;
    const secondary = theme.palette.secondary.main;

    // chart
    const optionsbarchart: any = {
        chart: {
            type: 'bar',
            fontFamily: "'Plus Jakarta Sans', sans-serif;",
            foreColor: '#adb0bb',
            toolbar: {
                show: false,
            },
            width: '100%',
            events: {
                dataPointSelection: (event: any, chartContext: any, config: any) => {
                    const clickedCategory = config.w.config.xaxis.categories[config.dataPointIndex];
                    console.log(clickedCategory);
                    setCategory(clickedCategory);
                }
            },
        },
        colors: colors,
        plotOptions: {
            bar: {
                horizontal: true,
                barHeight: '70%',
                columnWidth: '42%',
                borderRadius: [6],
                borderRadiusApplication: 'end',
                distributed: true,
            },
        },
        states: {
            active: {
                filter: {
                    type: 'none',
                },
            },
        },
        stroke: {
            show: false,
            width: 4,
            lineCap: "butt",
            colors: ["transparent"],
          },
        dataLabels: {
            enabled: false,
        },
        legend: {
            show: false,
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
        yaxis: {
            max: 4,
            min: 0,
            stepSize: 1,
            forceNiceScale: true,

        },
        xaxis: {
            categories: categories,
            axisBorder: {
                show: true,
            },
        },
        tooltip: {
            enabled: false,
            theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
            fillSeriesColor: false,
        },
    };
    const seriesbarchart: any = [
        {
            data: data,
        },
    ];

    return (

        <DashboardCard
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* <div style={{ flex: 1, display: 'flex' }}> */}
                
                <Chart
                    options={optionsbarchart}
                    series={seriesbarchart}
                    type="bar"
                    height= {chartHeight}
                    width= '100%'
                />
                <Stack direction="row" spacing={2} sx={{ mb: 2 }} justifyContent='space-evenly' width='100%'>
                    {label === 'positive'
                    ? <>

                        <SentimentVeryDissatisfiedIcon 
                            style = {{color: 'grey'}}/>
                        <SentimentSatisfiedAltIcon 
                            style={{ color: 'grey' }}/>
                    </>
                    : <>
                    <SentimentSatisfiedAltIcon 
                        style = {{color: 'grey'}}/>
                    <SentimentVeryDissatisfiedIcon 
                        style = {{color: 'grey'}}/></>
                    }

                </Stack>
            {/* </div> */}
            </Box>
        </DashboardCard>
    );
};

export default HorizontalBarChart;