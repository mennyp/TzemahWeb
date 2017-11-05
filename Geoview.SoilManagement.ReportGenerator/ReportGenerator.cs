using System;
using System.Collections.Generic;
using System.Configuration;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Net;
//using DDK.Inf.Log;
using Telerik.Windows.Documents.Flow.FormatProviders.Docx;
using Telerik.Windows.Documents.Flow.Model;
using Telerik.Windows.Documents.Flow.Model.Editing;
using Telerik.Windows.Documents.Flow.Model.Shapes;
using Telerik.Windows.Documents.Flow.Model.Styles;
using Telerik.Windows.Documents.Media;

namespace Geoview.SoilManagement.ReportGenerator
{



    //[Log]
    public class ReportGenerator
    {
        #region Privates

        private RadFlowDocument m_Document;
        private RadFlowDocumentEditor m_Editor;

        #endregion

        #region Constructor

        public ReportGenerator(string oTemplatePath)
        {
            DocxFormatProvider provider = new DocxFormatProvider();

            using (Stream input = File.OpenRead(oTemplatePath))
            {
                m_Document = provider.Import(input);
                m_Editor = new RadFlowDocumentEditor(new RadFlowDocument());

            }
        }

        #endregion



        public byte[] BuildReport(DataCell[,] pitsDesc,
            DataCell[,] labDataGrid, DataCell[,] fieldDataGrid, string mapImageUrl, List<string> attachedFiles)
        {


            ReportDataSource reportDataSource = new ReportDataSource();

            m_Document = m_Document.MailMerge(new List<ReportDataSource>() { reportDataSource });

            Section section = m_Document.Sections[0];
            if (pitsDesc != null)
            {
                AddNewHeader(section, "תיאור ממצאי הסקר");

                List<Table> pitDataTables = new TableBuilder(pitsDesc).Resolve(m_Document, 0, 100);
                foreach (Table table in pitDataTables)
                {
                    section.Blocks.Add(table);

                    section.Blocks.Add(new Paragraph(m_Document));

                }
            }
            if (labDataGrid != null)
            {

                AddNewHeader(section, "תוצאות בדיקת מעבדה");

                List<Table> labDataTables = new TableBuilder(labDataGrid).Resolve(m_Document,
                    Convert.ToInt32(ConfigurationManager.AppSettings["labDataRepeaters"]),
                    Convert.ToInt32(ConfigurationManager.AppSettings["tableMax"]));
                foreach (Table table in labDataTables)
                {
                    section.Blocks.Add(table);

                    section.Blocks.Add(new Paragraph(m_Document));


                }
            }


            if (fieldDataGrid != null)
            {

                AddNewHeader(section, "תוצאות נתוני שטח");

                List<Table> fieldDataTables = new TableBuilder(fieldDataGrid).Resolve(m_Document,
                    Convert.ToInt32(ConfigurationManager.AppSettings["fieldDataRepeaters"]),
                    Convert.ToInt32(ConfigurationManager.AppSettings["tableMax"]));
                foreach (Table table in fieldDataTables)
                {
                    section.Blocks.Add(table);

                    section.Blocks.Add(new Paragraph(m_Document));

                }
            }

            if (mapImageUrl != null)
            {
                AddNewHeader(section, "מפה");
                CreateImage(mapImageUrl, section);
                section.Blocks.Add(new Paragraph(m_Document));
            }

            if (attachedFiles != null)
            {

                AddNewHeader(section, "קבצים מקושרים");
                foreach (string attachedFileUrl in attachedFiles)
                {
                    CreateImage(attachedFileUrl, section);
                    section.Blocks.Add(new Paragraph(m_Document));
                }

            }

            DocxFormatProvider formatProvider = new DocxFormatProvider();
            byte[] renderedBytes = null;
            using (MemoryStream ms = new MemoryStream())
            {
                formatProvider.Export(m_Document, ms);
                renderedBytes = ms.ToArray();
            }
            return renderedBytes;


        }

        private void CreateImage(string mapImageUrl, Section section)
        {
            Paragraph mapParagraph = new Paragraph(m_Document);
            ImageInline mapImageInline = mapParagraph.Inlines.AddImageInline();
            GetMap(mapImageUrl, mapImageInline);
            mapImageInline.Image.Width = Convert.ToDouble(ConfigurationManager.AppSettings["imageWidth"]);
            mapImageInline.Image.Height = Convert.ToDouble(ConfigurationManager.AppSettings["imageHeight"]);
            section.Blocks.Add(mapParagraph);
        }

        private void GetMap(string imageUrl, ImageInline mapImageInline)
        {
            ;
            using (WebClient webClient = new WebClient())
            {
                byte[] data =
                    webClient.DownloadData(imageUrl);

                using (MemoryStream mem = new MemoryStream(data))
                {
                    mapImageInline.Image.ImageSource = new ImageSource(mem, "png");

                }
            }
        }
        private void AddNewHeader(Section section, string headerText)
        {

            Paragraph pitDesc = section.Blocks.AddParagraph();
            Run pitsDescItem = pitDesc.Inlines.AddRun(headerText);
            pitDesc.FlowDirection = FlowDirection.RightToLeft;
            pitDesc.StyleId = "Heading2";
            pitDesc.Inlines.Add(new Break(m_Document));
        }
    }
}
