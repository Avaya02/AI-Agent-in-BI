import { PowerBIEmbed } from "powerbi-client-react";
import { models } from "powerbi-client";

const PowerBi = ({ embedUrl, accessToken }) => {
  return (
    <PowerBIEmbed
      embedConfig={{
        type: "report",
        id: "<REPORT_ID>",
        embedUrl: embedUrl,
        accessToken: accessToken,
        tokenType: models.TokenType.Embed,
        settings: {
          filterPaneEnabled: false,
          navContentPaneEnabled: false,
        },
      }}
      eventHandlers={{
        loaded: () => console.log("Power BI Report Loaded"),
        error: (event) => console.error("Power BI Error", event.detail),
      }}
    />
  );
};

export default PowerBi;
