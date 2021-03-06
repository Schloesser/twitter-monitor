
package de.htwsaar.controller;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import de.htwsaar.model.User;
import de.htwsaar.service.user.UserService;

/**
 * The HomeController Class is the communication interface between user-related
 * frontend / backend functionality such as:
 * 
 * - Login - Registration
 * 
 * @author Philipp Schaefer, Marek Kohn, Stefan Schloesser
 * 
 */
@Controller
public class HomeController {

	private UserService userService;

	@Autowired
	public void serUsersService(UserService userService) {
		this.userService = userService;
	}

	/**
	 * This method displays the home.jsp when the root path of the website is
	 * called.
	 * 
	 * @param model
	 *            - the User Model representing a user that is either singning
	 *            in or up
	 */
	@RequestMapping("/")
	public String showHome(Model model) {
		model.addAttribute("user", new User());
		return "home";
	}

	/**
	 * This method controlls the registration process by evaluating the user
	 * input data and forwarding the created User Object to the UserService
	 * 
	 * @param user
	 *            - the newly registered user
	 * @param result
	 *            - the response received from the frontend
	 * @return the webpage that is called after the process is finished.
	 * 
	 */
	@RequestMapping(value = "/newAccount", method = RequestMethod.POST)
	public String newAccount(@Valid User user, BindingResult result) {

		if (result.hasErrors()) {
			System.out.println(result);
			return "home";
		}

		user.setAuthority("user");

		try {
			userService.insertUser(user);
		} catch (DuplicateKeyException e) {
			result.rejectValue("username", "DuplicateKey.username", "Dieser Benutzername existiert bereits.");
			return "home";
		}
		return "home";
	}

	@RequestMapping("/instructions")
	public String showInstructions() {
		return "instructions";
	}
}
