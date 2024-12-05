import ReactEcharts from "echarts-for-react"; 

function Viz(props) {
    return <ReactEcharts option={props.dataviz} opts={{renderer: 'svg'}} notMerge={true}/>;
}

export default Viz