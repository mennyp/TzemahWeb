using System;
using System.Collections.Generic;
using System.Net.Mime;
//using DDK.Inf.Log;
using Telerik.Windows.Documents.Flow.Model.Fields;

namespace Geoview.SoilManagement.ReportGenerator
{
    //[Log]
    public class PitDescriptionResolver 
    {
        private readonly List<PitsDesc> m_PitsDesc;

        public PitDescriptionResolver( List<PitsDesc> pitsDesc)
        {
            m_PitsDesc = pitsDesc;
        }

        public bool Resolve(Field field)
        {
            try
            {
                {
                    //field.Select();
                    //Selection selection = m_WordApp.Selection;
                    ////selection.MoveDown(WdUnits.wdScreen, 2);// adds tow pagedown presses
                    //for (int i = 0; i < m_PitsDesc.Count; i++)
                    //{
                    //    PitsDesc pitContent = m_PitsDesc[i];
                    //    selection.TypeText(Environment.NewLine);
                    //    string header = string.Format(@"{0}", pitContent.Header);
                    //    selection.TypeText(header);
                    //    selection.TypeText(Environment.NewLine);

                    //    selection.TypeText(pitContent.Content);
                    //    selection.TypeText(Environment.NewLine);

                    //}
                }
            }
            catch (Exception)
            {
                return false;
            }
            return true;
        }
    }
}
