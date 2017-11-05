using System;
using System.Collections.Generic;
using System.Windows.Documents;
using System.Windows.Media;
//using DDK.Inf.Log;
using Telerik.Windows.Documents.Flow.Model;
using Telerik.Windows.Documents.Flow.Model.Styles;
using Telerik.Windows.Documents.Spreadsheet.Model;
using Color = System.Drawing.Color;
using Paragraph = Telerik.Windows.Documents.Flow.Model.Paragraph;
using Run = Telerik.Windows.Documents.Flow.Model.Run;
using Table = Telerik.Windows.Documents.Flow.Model.Table;

namespace Geoview.SoilManagement.ReportGenerator
{
    //[Log]
    public class TableBuilder 
    {
        private readonly DataCell[,] m_LabDataGrid;
        public TableBuilder( DataCell[,] labDataGrid)
        {
            m_LabDataGrid = labDataGrid;
        }


        public List<Table>  Resolve(RadFlowDocument document,int repeatingColumns,int maxColumnWidth)
        {
            int numRows = m_LabDataGrid.GetLength(0);
            int numColumns = m_LabDataGrid.GetLength(1);
            List<Table> labDataTables = new List<Table>();
            int numOfColumnsExcludingRepeating = maxColumnWidth - repeatingColumns;

            
            for (int fromColumn = repeatingColumns; fromColumn < numColumns; fromColumn+= numOfColumnsExcludingRepeating)
            {
                int toColumn = fromColumn + numOfColumnsExcludingRepeating;
                if (toColumn > numColumns)
                {
                    toColumn = numColumns;
                }

                Table table = new Table(document, numRows, toColumn - fromColumn + repeatingColumns)
                {
                    LayoutType = TableLayoutType.AutoFit,
                    StyleId = "GridTable4-Accent3",
                    FlowDirection = FlowDirection.RightToLeft,
                    
                };

                try
                {
                    {

                        for (int j = 0; j < repeatingColumns; j++)
                        {
                            for (int i = 0; i < numRows; i++)
                            {
                                DataCell labDataCell = m_LabDataGrid[i, j];


                                TableCell cell = table.Rows[i].Cells[j];
                                Paragraph paragraph = cell.Blocks.AddParagraph();
                                Run labelRun = paragraph.Inlines.AddRun(labDataCell.Value);
                                
                            }
                        }

                        for (int j = fromColumn; j < toColumn; j++)
                        {
                            for (int i = 0; i < numRows; i++)
                            {
                                DataCell labDataCell = m_LabDataGrid[i, j];

                                int currTableCol = j - labDataTables.Count* numOfColumnsExcludingRepeating;

                                TableCell tableCell = table.Rows[i].Cells[currTableCol];


                                Paragraph paragraph = tableCell.Blocks.AddParagraph();
                                
                                Run labelRun = paragraph.Inlines.AddRun(labDataCell.Value);
                                Color color = labDataCell.Color;
                                if (color.R != 0 || color.G != 0 || color.B != 0)
                                {
                                    labelRun.HighlightColor = System.Windows.Media.Color.FromRgb(color.R, color.G,
                                        color.B);
                                }

                            }
                        }

                       
                    }
                }
                catch (Exception e)
                {
                    //Logger.LogMessage(LogInfo.Error, @"could not build labdata table \n" + e);
                    return null;
                }
                labDataTables.Add(table);

            }
            return labDataTables;
        }
    }
}
