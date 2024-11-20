import { useEffect } from "react";
import ReactGA from "react-ga4";

const Analytics = () => {
    useEffect(()=>{

        ReactGA.initialize("G-0124H40R9B");
    }, [])
    return null
};

export default Analytics;