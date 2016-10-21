# Destiny Analytics

Just a nice service that wants to store all of the Destiny character data you give it! It wants to store snapshots of data, so that when you query for it, it'll allow you to see that data over a period of time, relative to itself or to some other benchmark data.

By default this will use [Firebase](https://firebase.google.com) as the backend because it's easy!

# Polling

Needs some basic information:

- membershipIds
- characterIds per membershipId
- polling interval

how it might work:

- subscribe to onPoll events that will yield `{ data, membershipId, characterId }`
- cronjob to poll at an interval
- can start/stop/find next polling time.
- should be scheduling polling events into a queue,




# License 

MIT