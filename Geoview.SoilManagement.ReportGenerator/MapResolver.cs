
using System;
using System.Drawing;
//using DDK.Inf.Log;
using Telerik.Windows.Documents.Flow.Model;
using Telerik.Windows.Documents.Flow.Model.Fields;

namespace Geoview.SoilManagement.ReportGenerator
{
    //[Log]
    public class MapResolver 
    {
        private readonly string m_MapImagePath;

        public MapResolver( string mapImagePath)
        {
            m_MapImagePath = mapImagePath;
        }

        public Image Resolve(RadFlowDocument field)
        {
            try
            {
                {
                    // field.Select();
                    //Selection selection = m_WordApp.Selection;
                    ////selection.MoveDown(WdUnits.wdScreen, 2);// adds tow pagedown presses
                    //selection.InlineShapes.AddPicture(m_MapImagePath);//adds image on new page
                }
            }
            catch (Exception)
            {
                return null;
            }
            return null;
        }

    }
}
