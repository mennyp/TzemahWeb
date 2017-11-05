//using DDK.Inf.Log;

namespace Geoview.Tzemah.Common.Fields
{
    //[Log]
    public abstract class Field<TKey>
    {
        private TKey _key;

        public Field(TKey key)
        {
            _key = key;
        }

        public TKey Key { get { return _key; } }

        public abstract object Parse(string value);
    }
}
