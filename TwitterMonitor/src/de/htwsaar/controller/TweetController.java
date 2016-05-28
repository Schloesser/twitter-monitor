package de.htwsaar.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import de.htwsaar.twitter.Tweet;
import de.htwsaar.twitter.TweetService;

@Controller
public class TweetController
{

	private TweetService tweetService;

	@Autowired
	public void setTweetService(TweetService tweetService)
	{
		this.tweetService = tweetService;
	}

	@RequestMapping("/tweets_v3")
	public String showAdd(Model model)
	{
		int tweetListSize = 20;
		List<Tweet> tweetsRow = tweetService.getTweets();
		ArrayList<Tweet> tweets1 = new ArrayList<Tweet>();
		ArrayList<Tweet> tweets = new ArrayList<Tweet>();
		
		for (int i=tweetListSize-1;i > 0;i--)
		{
			tweets1.add(tweetsRow.get(tweetsRow.size()-i));
		}
		for (Tweet tweet : tweets1)
		{
			tweets.add(tweet);
			if (tweetListSize == tweets.size())
			{
				break;
			}
		}

		model.addAttribute("tweets", tweets);

		return "tweets_v3";
	}

}