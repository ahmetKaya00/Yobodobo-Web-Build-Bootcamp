using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using YoboApi.Dtos;
using YoboApi.Models;

namespace YoboApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<AppUser> _userManager;
    private readonly SignInManager<AppUser> _signInManager;
    private readonly IConfiguration _configuration;

    public AuthController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, IConfiguration configuration)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _configuration = configuration;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest dto)
    {
        var exists = await _userManager.FindByEmailAsync(dto.Email);
        if (exists != null)
            return Conflict(new { message = "Bu e-posta zaten kayıtlı." });
        
        var user = new AppUser
        {
            UserName = dto.Email,
            Email = dto.Email,
            FullName = dto.FullName
        };
        var result = await _userManager.CreateAsync(user, dto.Password);
        if (!result.Succeeded)
        {
            return BadRequest(new { message = "Kullanıcı oluşturulamadı.", errors = result.Errors });
        }

        var token = GenerateToken(user);
        return Ok(token);
    }

    private object GenerateToken(AppUser user)
    {
        var jwt = _configuration.GetSection("JwtSettings");

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt["SecretKey"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id),
            new (JwtRegisteredClaimNames.Email , user.Email ?? ""),
            new (ClaimTypes.Name , user.UserName ?? user.Email ?? ""),
            new(ClaimTypes.NameIdentifier, user.Id)
        };
        var expires = DateTime.UtcNow.AddMinutes(double.Parse(jwt["ExpirationMinutes"]!));

        var token = new JwtSecurityToken(
            issuer: jwt["Issuer"],
            audience: jwt["Audience"],
            claims: claims,
            expires: expires,
            signingCredentials: creds
        );

        return new YoboApi.Dtos.AuthResponse
        {
            Token = new JwtSecurityTokenHandler().WriteToken(token),
            Email = user.Email ?? "",
            FullName = user.FullName,
            ExpiresAt = expires
        };
    }
}