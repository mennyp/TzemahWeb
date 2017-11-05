using System;
using System.Collections.Generic;
//using DDK.Inf.Log;
using Newtonsoft.Json;

namespace Geoview.Tzemah.Common.FieldData
{
    //[Log]
    public class FieldDataSerializer : JsonConverter
    {
        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            var fieldDataModel = value as FieldDataModel;
            IEnumerable<KeyValuePair<string, object>> properties = fieldDataModel.GetProperties(true);


            writer.WriteStartObject();
            foreach (KeyValuePair<string, object> property in properties)
            {
                writer.WritePropertyName(property.Key);
                serializer.Serialize(writer, property.Value);
            }

            writer.WriteEndObject();



        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            throw new NotImplementedException();
        }

        public override bool CanConvert(Type objectType)
        {
            throw new NotImplementedException();
        }
    }
}
