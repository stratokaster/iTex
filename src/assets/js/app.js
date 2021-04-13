"use strict";
import $ from 'jquery';
import { gsap, Power2, ScrollTrigger } from 'gsap/all';
import barba from '@barba/core';
gsap.registerPlugin(ScrollTrigger);

$(window).resize(function(){
    projectsInit();
})
$(document).ready(function(){
    sidebarToggle('#hamburger');
    sidebarToggle('.sidebar__arrow');
    addOverflowClass('.sidebar__body');
    addOverflowClass('.site__content');
    $(".scroll").on('click', function(event){
        event.preventDefault();
        var full_url = $(this).attr('href');
        var target_offset = $(full_url).offset();
        var target_top = target_offset.top;
        gsap.to('.site__content', {
            duration: 1,
            scrollTop: $('.site__content').scrollTop() + target_top,
            ease: Power2.easeOut
        });
    });
    barba.init({
        sync: true,
        transitions: [{
            name: 'opacity-transition',
            async leave(data) {
                const done = this.async();
                pageTransition(data);
                await delay(1000);
                done();
            },
            async enter(data) {
                contentAnimation(data);
            },
            async once(data) {
                contentAnimation(data);
            }
        }]
    });
    $('#year').html(new Date().getFullYear());
})
function delay(n){
    n = n || 2000
    return new Promise(done => {
        setTimeout(()=>{
            done();
        }, n);
    })
}
function contentAnimation(data){
    let tl = gsap.timeline();
    $('.site__content').scrollTop(0)
    switch (data.next.namespace) {
        case "skils": 
            tl.from('.skils__thumbnail', {
                duration: .5,
                x: 200,
                opacity: 0
            }).from('.skils_before', {
                scaleY: 0,
                transformOrigin: 'bottom right',
                opacity: 0,
                duration: 0.5,
            }).from('.skils__description > *', {
                y: 100,
                opacity: 0,
                duration: 0.5,
                stagger: 0.2
            })
            break;
        case "project": 
            tl.from('.project__thumbnail', {
                duration: .5,
                x: 200,
                opacity: 0
            }).from('.project__header_before', {
                scaleY: 0,
                transformOrigin: 'bottom right',
                opacity: 0,
                duration: 0.5,
            }).from('.project__description > *', {
                y: 100,
                opacity: 0,
                duration: 0.5,
                stagger: 0.2
            })
            break;
        case "home":
            homepageInit();
            break;
    }
}

function homepageInit(){
    projectsInit();
    $('.faq__question').on('click', function(){
        let $faqItem = $(this).parent();
        if($faqItem.hasClass('opened')){
            $faqItem.removeClass('opened').find('.faq__answer').slideUp(300);
        }else{
            $('.faq__item').removeClass('opened').find('.faq__answer').slideUp(300);
            $faqItem.addClass('opened').find('.faq__answer').slideDown(300);
        }
    })



    // MAIN SCREEN ANIMATIONS

    let mainTl = gsap.timeline();
    mainTl.from('.main_nav li', 1, {opacity: 0, x: 200, stagger: 0.1})
          .to('.main_decorations .square', 1, {opacity: 1, x: 0, rotate: 360, stagger: 0.1, delay: 0});

    // ABOUT SECTION ANIMATIONS
    let aboutTl = gsap.timeline({
        scrollTrigger: {
            scroller: '.site__content',
            trigger: "#about",
            toggleActions: 'restart pause resume pause'
        }
    });
    aboutTl
    .from('#about .section__title', {duration: 0.5, x: 400, opacity: 0 })
    .from('#about .section__description', {duration: 0.5, x: 400, opacity: 0 })
    .from('.statistic__item', { duration: 0.5, y: 200, opacity: 0, stagger: .2 })
    .from('.faq__item', { duration: 0.5, y: 200, opacity: 0, stagger: .2 })
    .from('.btn__block', { duration: 0.5, y: 100, opacity: 0 })
   
    let aboutDecorTl = gsap.timeline({
        scrollTrigger: {
            scroller: '.site__content',
            trigger: ".about_decorations .square",
            toggleActions: 'restart resume resume resume'
        }
    });
    aboutDecorTl.to('.about_decorations .square', { duration: 1, x: 0, opacity: 1, rotation: 360, stagger: 0.1 })
    
    
    // PROJECTS SECTION ANIMATIONS
    
    let projectsTl = gsap.timeline({
        scrollTrigger: {
            scroller: '.site__content',
            trigger: "#projects",
            start: 'top 80%',
            toggleActions: 'restart pause resume pause',
        }    
    });
    projectsTl
    .from('#projects .section__title', {duration: 0.3, x: 200, opacity: 0 })
    .from('#projects .section__description', {duration: 0.3, x: 200, opacity: 0 })
    .from('.projects_list__item_wrapper', { duration: 0.2, scale: 0, rotation: 90, stagger: 0.1 })
    let letsTalkDecorTl = gsap.timeline({
        scrollTrigger: {
            scroller: '.site__content',
            trigger: ".lets_talk_decorations .square",
            toggleActions: 'restart resume resume resume',
        }
    });
    letsTalkDecorTl.to('.lets_talk_decorations .square', {
        duration: 1,
        x: 0,
        opacity: 1,
        rotation: 360,
        stagger: 0.1
    })
}
function pageTransition(data){
    let tl = gsap.timeline();
    tl.to('.page_transition', {
        duration: 0.5,
        x: 0,
    }).to('.page_transition', {
        duration: 1,
        x: '-100%',
        delay: 0.5
    }).set('.page_transition', {
        x: '100%'
    })
}




function projectsInit(){
    let projects = $('.projects__slider');
    let projectsList = $('.projects_list');
    let projectsItems = projectsList.children();
    let projectsListWidth = 0;
    $.each(projectsItems, function(idx, item){
        projectsListWidth += $(item).innerWidth();
    })
    let itemWidth = projectsListWidth / projectsItems.length
    let itemsHalf = Math.round(projectsItems.length / 2)
    if(projectsListWidth > projects.innerWidth() * 2){
        projectsList.width(itemWidth * itemsHalf)
    }else{
        projectsList.width(projectsListWidth)
    }
    let transform = itemWidth;
    $('.projects__nav .prev').on('click', function(){
        gsap.to(projects, .4, {scrollLeft: projects.scrollLeft() - transform});
    })
    $('.projects__nav .next').on('click', function(){
        gsap.to(projects, .4, {scrollLeft: projects.scrollLeft() + transform});
    })
}
function sidebarToggle(selector){
    $(selector).on('click', function(){
        let menuTl = gsap.timeline();
        $('.sidebar').toggleClass('active');
        if($('.sidebar').hasClass('active')){
            menuTl.staggerTo('#menu li', .5, {
                opacity: 1,
                x: 0
            }, .1)
        }else{
            menuTl.staggerTo('#menu li', .5, {
                opacity: 0,
                x: 200
            }, .1)
        }
    })
}
function addOverflowClass(selector){
    let $sidebarBody = $(selector)[0];
    if($sidebarBody.scrollHeight > $sidebarBody.offsetHeight){
        $(selector).addClass('scrollable');
    }else{
        $(selector).removeClass('scrollable');
    }
}
