interface MonthSelectorProps {
    onMonthChange?: (month: number, year: number) => void;
    allowFuture?: boolean;
    locked?: boolean;
}

export default MonthSelectorProps;