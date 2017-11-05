using System;
//using DDK.Inf.Log;

namespace Geoview.Tzemah.Common.Fields
{
    //[Log]
    public class DecimalField<TKey> : Field<TKey>
    {
        public DecimalField(TKey name) : base(name) { }
        public override object Parse(string value)
        {
            return Convert.ToDecimal(value);
        }



    }
}
