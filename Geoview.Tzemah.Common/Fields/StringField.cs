//using DDK.Inf.Log;

namespace Geoview.Tzemah.Common.Fields
{
   //[Log]
    public class StringField<TKey> : Field<TKey>
    {
        public StringField(TKey name) : base(name) { }

        public override object Parse(string value)
        {
            return value.ToString().Trim();
        }
    }
}
