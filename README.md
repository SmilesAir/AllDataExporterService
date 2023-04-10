# AllDataExporterService

Microservice that gets data from all results based services and aggregates into a JSON object. Any software developer should be able to take the output and parse the data into any new system in the future.

Link to [Exporter](https://freestylejudge.com/?startup=admin)

### Schema
    {
        playersData : object // Collection of all known players
        eventsData : object // Collection of all event details
        resultsData : object // Colection of all results from all events
        pointsData : object // Latest calculated Rankings/Ratings
    }

| Name | Description | Docs |
| ---- | ----------- | ---- |
| playersData | Names, Country, ... | [Link](https://github.com/SmilesAir/PlayerNameService) |
| eventsData | Event Dates, ... | [Link](https://github.com/SmilesAir/EventSummaryService) |
| resultsData | Results | [Link](https://github.com/SmilesAir/EventResultsService) |
| pointsData | Caculated Rankings/Ratings | [Link](https://github.com/SmilesAir/PointsService) |

## Player import from FPA Website Database
* Cache map by player_id to playerData
* Check if already imported, check if player_id exists
* If exact match
  * Is only exact match, add player_id to existing playerData
  * Multiple exact matches, new alias playerData, add player_id to new playerData
* Not exact match, add to list to print out
  * Manually create new alias, new alias playerData, add player_id to new playerData