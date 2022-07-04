# AllDataExporterService

Microservice that gets data from all results based services and aggregates into a JSON object. Any software developer should be able to take the output and parse the data into any new system in the future.

Link to [Exporter](https://freestylejudge.com/?startup=admin)

Schema below:

    {
        playersData : object // Collection of all known players
        eventsData : object // Collection of all event details
        resultsData : object // Colection of all results from all events
        pointsData : object // Latest calculated Rankings/Ratings
    }

More info on each data type
| Name | Description | Docs |
| ---- | ----------- | ---- |
| playersData | Names, Country, ... | [Link](https://github.com/SmilesAir/PlayerNameService) |
| eventsData | Event Dates, ... | [Link](https://github.com/SmilesAir/EventSummaryService) |
| resultsData | Results | [Link](https://github.com/SmilesAir/EventResultsService) |
| pointsData | Caculated Rankings/Ratings | [Link](https://github.com/SmilesAir/PointsService) |