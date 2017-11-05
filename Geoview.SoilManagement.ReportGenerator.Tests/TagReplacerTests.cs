using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using NUnit.Framework;

namespace Geoview.SoilManagement.ReportGenerator.Tests
{
    [TestFixture]
    public class TagReplacerTests
    {
        [Test]
        public void GivenTemplate_WhenAskedToReplaceDate_ThenDocumentWithCurrentDate()
        {
            

            //arrange
            
            DataCell[,] labDataGrid =
            {
                {new DataCell("cwwew"),new DataCell("pH"),new DataCell("Water")}
                ,{new DataCell("qwwwq"),new DataCell("222",Color.Blue),new DataCell("1.1",Color.Red) }
                ,{new DataCell("xxxx"),new DataCell("111",Color.Blue),new DataCell("6.1",Color.Red) }
                ,{new DataCell("aaaa"),new DataCell("33",Color.Blue),new DataCell("81",Color.Red) }
                ,{new DataCell("qqqq"),new DataCell("444",Color.Blue),new DataCell("9991",Color.Red) }
            };
            List<PitsDesc> pitsDesc = new List<PitsDesc>{
                new PitsDesc("בור 1111",string.Concat(Enumerable.Repeat("נתונים על בור 1",10)))
                ,new PitsDesc("בור 2222",string.Concat(Enumerable.Repeat("נתונים על בור 2",12)))
                ,new PitsDesc("בור 3333",string.Concat(Enumerable.Repeat("נתונים על בור 3",20)))
                ,new PitsDesc("בור 4444",string.Concat(Enumerable.Repeat("נתונים על בור 4",30)))
                };

            //act
            Report reportGenerator 
                = new Report( Image.FromFile(@"t:\temp\Project.jpg")
                    ,@"t:\temp\TzemahReportTemplate.dotx"
                    , pitsDesc, labDataGrid, labDataGrid,@"t:\temp\testReport.docx");
            //assert

        }
    }
}
