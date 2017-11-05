using System;
using System.Globalization;
//using DDK.Inf.Log;

namespace Geoview.Tzemah.Common.Fields
{
    //[Log]
    public class DateField<TKey> : Field<TKey>
    {
        public DateField(TKey name) : base(name) { }
        public override object Parse(string value)
        {
                return DateTime.ParseExact(value, "dd/MM/yyyy", new CultureInfo("en-US", true));
        }

    }
}
