using System;
//using DDK.Inf.Log;

namespace Geoview.Tzemah.Common.Fields
{
    //[Log]
    public class IntField<TKey> : Field<TKey>
    {
        public IntField(TKey name) : base(name) { }
        public override object Parse(string value)
        {
            return Convert.ToInt32(value);
        }

    }
}
