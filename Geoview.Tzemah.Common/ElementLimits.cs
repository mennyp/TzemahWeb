namespace Geoview.Tzemah.Common
{
    public class ElementLimits
    {
        public string ElementCol { get; private set; }
        public decimal Low { get; private set; }
        public decimal High { get; private set; }
        public decimal ErrorLow { get; private set; }
        public decimal ErrorHigh { get; private set; }


        public ElementLimits(string elementCol, decimal low, decimal high, decimal errorLow, decimal errorHigh)
        {
            ErrorHigh = errorHigh;
            ErrorLow = errorLow;
            High = high;
            Low = low;
            ElementCol = elementCol;
        }
    }
}